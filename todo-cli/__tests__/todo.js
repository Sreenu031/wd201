const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("first test suite", () => {
  test("checking list is empty", () => {
    expect(all.length).toBe(1);
  });

  add({
    title: "got to gym ",
    complete: false,
    dueDate: new Date().toISOString().slice(0, 10),
  });
  console.log(all[0].dueDate);
  test("todo item is marked as completed", () => {
    expect(all[0].complete).toBe(false);
  });
});
