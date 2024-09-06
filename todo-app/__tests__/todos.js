const db = require("../models/index");
const app = require("../app");
const request = require("supertest");
const { Json } = require("sequelize/lib/utils");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("response with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy a milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete", async () => {
    // Create a new todo
    const response = await agent.post("/todos").send({
      title: "Buy a milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    // Assert that the new todo is not completed
    expect(parsedResponse.completed).toBe(false); // Corrected toBe (lowercase)

    // Mark the todo as completed
    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);

    // Assert that the todo is now completed
    expect(parsedUpdateResponse.completed).toBe(true); // Corrected toBe (lowercase)
  });

  test("Delete a todo by ID", async () => {
    // Step 1: Create a new todo
    const response = await agent.post("/todos").send({
      title: "Buy a milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    // Assert that the new todo is created
    expect(parsedResponse.id).toBeDefined();
    expect(parsedResponse.title).toBe("Buy a milk");

    // Step 2: Delete the created todo
    const deleteResponse = await agent.delete(`/todos/${todoID}`).send();

    // Assert that the response status code is 200
    expect(deleteResponse.statusCode).toBe(200);
    const parsedDeleteResponse = JSON.parse(deleteResponse.text);

    // Assert that the deletion was successful
    expect(parsedDeleteResponse).toBe(true);

    // Step 3: Try to fetch the deleted todo
    const getDeletedTodoResponse = await agent.get(`/todos/${todoID}`).send();

    // Assert that the deleted todo no longer exists (likely returning a 404)
    expect(getDeletedTodoResponse.statusCode).toBe(404);
  });
});
