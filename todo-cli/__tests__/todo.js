const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo List Test Suite", () => {
  beforeEach(() => {
    // Clear the list before each test
    all.length = 0;
  });

  test("should create a new todo", () => {
    add({
      title: "Go to the gym",
      complete: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(1);
    expect(all[0].title).toBe("Go to the gym");
    expect(all[0].complete).toBe(false);
  });

  test("should mark a todo as completed", () => {
    add({
      title: "Submit assignment",
      complete: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    markAsComplete(0);
    expect(all[0].complete).toBe(true);
  });

  test("should retrieve overdue items", () => {
    add({
      title: "Pay bills",
      complete: false,
      dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), // 1 day in the past
    });
    add({
      title: "Meeting with team",
      complete: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const overdueItems = overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Pay bills");
  });

  test("should retrieve due today items", () => {
    add({
      title: "Daily standup meeting",
      complete: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].title).toBe("Daily standup meeting");
  });

  test("should retrieve due later items", () => {
    add({
      title: "Plan weekend trip",
      complete: false,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // 1 day in the future
    });
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("Plan weekend trip");
  });
});
