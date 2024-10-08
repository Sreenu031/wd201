const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");

const passport = require("passport")
const connectEnsureLogin = require('connect-ensure-login')
const session = require('express-session');
const LocalStrategy = require('passport-local');

const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser("some thing secret string!"))
app.use(csrf("this_should_be_32_character_long",["POST","PUT","DELETE"]))



app.use(session({
  secret:"my-super-secret-key-2323423423423",
  cookie:{
    maxAge:24 * 60 * 60 * 2000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
},(username,password,done)=>{
  
  User.findOne({where:{email:username}})
  .then(async (user)=>{
    
    const result = await bcrypt.compare(password,user.password);
 if(result){
  return done(null,user)
 }
    else{
      return done(null,false,{message:"invalid password"})
    }
  }).catch((error)=>{
    return done(error)
  })
}))

passport.serializeUser((user,done)=>{
  console.log("Serializing user in session",user.id);
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findByPk(id)
  .then(user=>{
    done(null,user)
  })
  .catch((error)=>{
    done(null,error)
  })
})
const { Todo,User } = require("./models");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

app.use(function(request, response, next) {
  response.locals.messages = request.flash();
  next();
});

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is logged in, redirect to /todos
    return res.redirect("/todos");
  } else {
    // If the user is not logged in, render the index (home) page
    res.render("index", {
      csrfToken: req.csrfToken(),
    });
  }
});
app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const loginUser = req.user.id;
  const allTodos = await Todo.getTodos(loginUser);
  if (req.accepts("html")) {
    res.render("todos", {
      allTodos,
      csrfToken:req.csrfToken(),
    });
  } else {
    res.json({ allTodos });
  }
});

app.get('/signup',(req,res)=>{
  res.render('signup',{csrfToken:req.csrfToken()})
})

app.post('/users',async (req,res)=>{
  const hashPwd = await bcrypt.hash(req.body.password,saltRounds);
  try{
    const user = await User.create({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      email:req.body.email,
      password:hashPwd,
    });
    req.login(user,(err)=>{
      if(err){
        console.log(error)
      }
      res.redirect("/todos")
    })
  
  }catch(error){
    console.log(error)
  }
  });

app.get('/login',(req,res)=>{
  res.render('login',{
    csrfToken:req.csrfToken(),
  });
});
app.get('/signout',(req,res,next)=>{
  req.logout((error)=>{
    if(error){
      return next(error);
    }
    res.redirect("/")
  })
})
app.post("/session",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
  
  res.redirect('/todos')
})

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      completed: false,
      userId:req.user.id,
    });
    return res.redirect('/todos')
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach((err) => req.flash('error', err.message));
      return res.redirect('/todos');
    }
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  try {
    if(todo){
      const updatedTodo = await todo.setCompletionStatus();
      return res.json(updatedTodo);
    }
    res.json({error:"no todo find"})
    
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    await Todo.remove(todoId,req.user.id)
    return res.json({success:true})
  } catch (error) {
    console.log(error);
    res.status(422).json(false);
  }
  // Return a success response after deletion
});

module.exports = app;
