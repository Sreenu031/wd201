const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Todo } = require("./models");

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
    return res.json(todo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.send(false).status(422);
    }

    await todo.destroy();
    return res.send(todo ? true : false);
  } catch (error) {
    console.log(error);
    res.status(422).json(false);
  }
  // Return a success response after deletion
});

module.exports = app;
