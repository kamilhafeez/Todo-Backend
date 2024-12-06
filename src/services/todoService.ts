import Todo from "../models/todo";

export interface UpdateTodoParams {
  id: string;
}

export interface TodoBody {
  completed?: boolean;
  title?: string;
}

export class TodoService {
  /**
   * Fetch all todos for a specific session.
   * @param sessionId - The session ID of the user.
   * @returns An array of todos.
   */
  static getTodos(sessionId: string) {
    try {
      return Todo.find({ sessionId });
    } catch (err) {
      throw new Error("Failed to fetch todos");
    }
  }

  /**
   * Add a new todo for the session.
   * @param sessionId - The session ID of the user.
   * @param title - The title of the todo.
   * @returns The created todo object.
   */
  static addTodo(sessionId: string, title: string) {
    try {
      const newTodo = new Todo({
        sessionId,
        title,
        completed: false,
      });
      return newTodo.save();
    } catch (err) {
      throw new Error("Failed to add todo");
    }
  }

  /**
   * Update a todo's title or completion status.
   * @param sessionId - The session ID of the user.
   * @param id - The ID of the todo to update.
   * @param title - The new title (optional).
   * @returns The updated todo object.
   */
  static async updateTodo(sessionId: string, id: string, title?: string) {
    try {
      const todo = await Todo.findOne({ _id: id, sessionId });
      if (!todo) {
        throw new Error("Todo not found");
      }

      const updateFields = !title ? { completed: !todo.completed } : { title };

      return Todo.findOneAndUpdate(
        { _id: id, sessionId },
        { $set: updateFields },
        { new: true }
      );
    } catch (err) {
      throw new Error((err as Error).message || "Failed to update todo");
    }
  }

  /**
   * Delete a todo by ID.
   * @param sessionId - The session ID of the user.
   * @param id - The ID of the todo to delete.
   * @returns A success message.
   */
  static async deleteTodo(sessionId: string, id: string) {
    try {
      const response = await Todo.deleteOne({
        sessionId,
        _id: id,
      });

      if (!response.acknowledged) {
        throw new Error("Todo not found");
      }

      return { message: "Todo deleted successfully!" };
    } catch (err) {
      throw new Error((err as Error).message || "Failed to delete todo");
    }
  }
}
