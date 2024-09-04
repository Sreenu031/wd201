"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTodos = await Todo.overdue();
      overdueTodos.forEach((todo) => console.log(todo.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const dueTodayTodos = await Todo.dueToday();
      dueTodayTodos.forEach((todo) => console.log(todo.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const dueLaterTodos = await Todo.dueLater();
      dueLaterTodos.forEach((todo) => console.log(todo.displayableString()));
    }

    static async overdue() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: today,
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      const today = new Date().toISOString().split("T")[0];
      let checkbox = this.completed ? "[x]" : "[ ]";
      let dueDateString = "";

      // Show due date for past-due or future tasks if completed
      if (this.dueDate !== today || this.completed) {
        dueDateString = this.dueDate;
      }

      // If the todo is due today and incomplete, do not show the date
      if (this.dueDate === today && !this.completed) {
        return `${this.id}. ${checkbox} ${this.title.trim()}`;
      }

      // For other cases, include the due date
      return `${this.id}. ${checkbox} ${this.title.trim()} ${dueDateString}`;
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
