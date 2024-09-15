"use strict";
const { Model, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User,{
        foreignKey:'userId'
      })
    }
    static addTodo({ title, dueDate,userId }) {
      return this.create({ title: title, dueDate: dueDate, completed: false,userId });
    }

    static async getTodos(userId) {
      return this.findAll({where:{
        userId,
      }});
    }
    static async remove(id,userId){
      return this.destroy({
        where:{
          id,
          userId,
        }
      })
    }
     async setCompletionStatus() {
      this.completed = !this.completed;
      await this.save()
      return this;
    }
  }
  Todo.init(
    {
      title:
      {type:DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "*Title cannot be empty",
          },
        },
      }, 
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "*Due date cannot be empty",
          },
        },
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
