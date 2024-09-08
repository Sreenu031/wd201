const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser("some thing secret string!"))
app.use(csrf("this_should_be_32_character_long",["POST","PUT","DELETE"]))
const { Todo } = require("./models");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const allTodos = await Todo.getTodos();
  if (req.accepts("html")) {
    res.render("index", {
      allTodos,
      csrfToken:req.csrfToken(),
    });
  } else {
    res.json({ allTodos });
  }
});
app.get("/todos", async (req, res) => {
  console.log("My TodosList:");
  try {
    const todo = await Todo.findAll();
    return res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      completed: false,
    });
    return res.redirect('/')
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

app.put("/todos/:id", async (req, res) => {
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
    await Todo.remove(todoId)
    return res.json({success:true})
  } catch (error) {
    console.log(error);
    res.status(422).json(false);
  }
  // Return a success response after deletion
});

module.exports = app;
