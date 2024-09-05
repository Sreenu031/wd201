const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Second item",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`created todo with id:${todo.id}`);
  } catch (error) {
    console.log(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`the total records are:${totalCount}`);
  } catch (error) {
    console.log(error);
  }
};

const getAllTodos = async () => {
  try {
    const todos = await Todo.findAll({});
    const todoList = todos.map((todo) => todo.displayableString()).join("\n");
    console.log(todoList);
  } catch (error) {
    console.log(error);
  }
};

const getSingleTodo = async () => {
  try {
    const todo = await Todo.findOne({
      where: {
        completed: false,
      },
      order: [["id", "DESC"]],
    });

    console.log(todo.displayableString());
  } catch (error) {
    console.log(error);
  }
};

const updateItem = async (index) => {
  try {
    await Todo.update({ completed: true }, { where: { id: index } });
    console.log(`Item updated at index:${index}`);
  } catch (error) {
    console.log(error);
  }
};

const deleteItem = async (index) => {
  try {
    const deleteRowCount = await Todo.destroy({
      where: {
        id: index,
      },
    });
    console.log(`Deleted ${deleteRowCount} rows`);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  // await createTodo();
  //await countItems();
  await getAllTodos();
  //await getSingleTodo();
  //await updateItem(2);
  //await getAllTodos();
  await deleteItem(2);
  await getAllTodos();
})();
