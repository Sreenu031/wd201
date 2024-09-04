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

      // If the todo is due today, and it's incomplete, do not show the date
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title.trim()}`;
      }

      // Otherwise, return the full string with the due date (for both overdue and future tasks)
      return `${this.id}. ${checkbox} ${this.title.trim()} ${this.dueDate}`;
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
