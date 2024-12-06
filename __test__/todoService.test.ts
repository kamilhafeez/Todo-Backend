import Todo from "../src/models/todo";
import { TodoService } from "../src/services/todoService";
import { Document } from "mongoose";

jest.mock("../src/models/todo");

const mockedTodo = Todo as jest.Mocked<typeof Todo>;

describe("Todo Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should fetch todos for a specific session", async () => {
      const mockTodos: Partial<Document>[] = [
        { _id: "1", title: "Test Todo 1", completed: false },
        { _id: "2", title: "Test Todo 2", completed: true },
      ] as any;

      mockedTodo.find.mockResolvedValue(mockTodos as any);

      const result = await TodoService.getTodos("test-session-id");

      expect(mockedTodo.find).toHaveBeenCalledWith({
        sessionId: "test-session-id",
      });
      expect(result).toEqual(mockTodos);
    });

    it("should throw an error if fetching todos fails", async () => {
      mockedTodo.find.mockRejectedValue(new Error("Database error"));

      await expect(TodoService.getTodos("test-session-id")).rejects.toThrow(
        "Failed to fetch todos"
      );
    });
  });

  describe("addTodo", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        _id: "1",
        title: "New Todo",
        completed: false,
        sessionId: "test-session-id",
        save: jest.fn().mockResolvedValue(this),
      } as Partial<Document> as any;

      mockedTodo.prototype.save.mockResolvedValue(newTodo);

      const result = await TodoService.addTodo("test-session-id", "New Todo");

      expect(result).toEqual(newTodo);
      expect(mockedTodo.prototype.save).toHaveBeenCalled();
    });

    it("should throw an error if adding a todo fails", async () => {
      mockedTodo.prototype.save.mockRejectedValue(new Error("Database error"));

      await expect(
        TodoService.addTodo("test-session-id", "New Todo")
      ).rejects.toThrow("Failed to add todo");
    });
  });

  describe("updateTodo", () => {
    it("should update a todo's title", async () => {
      const oldTodo = {
        _id: "1",
        title: "Old Todo",
        completed: false,
      } as Partial<Document> as any;

      const updatedTodo = {
        _id: "1",
        title: "Updated Todo",
        completed: false,
      } as Partial<Document> as any;

      mockedTodo.findOne.mockResolvedValue(oldTodo);
      mockedTodo.findOneAndUpdate.mockResolvedValue(updatedTodo);

      const result = await TodoService.updateTodo(
        "test-session-id",
        "1",
        "Updated Todo"
      );

      expect(mockedTodo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "1", sessionId: "test-session-id" },
        { $set: { title: "Updated Todo" } },
        { new: true }
      );
      expect(result).toEqual(updatedTodo);
    });

    it("should throw an error if updating a todo fails", async () => {
      mockedTodo.findOneAndUpdate.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        TodoService.updateTodo("test-session-id", "1", "Updated Todo")
      ).rejects.toThrow("Database error");
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", async () => {
      mockedTodo.deleteOne.mockResolvedValue({ acknowledged: true } as any);

      const result = await TodoService.deleteTodo("test-session-id", "1");

      expect(mockedTodo.deleteOne).toHaveBeenCalledWith({
        sessionId: "test-session-id",
        _id: "1",
      });
      expect(result).toEqual({ message: "Todo deleted successfully!" });
    });

    it("should throw an error if deleting a todo fails", async () => {
      mockedTodo.deleteOne.mockRejectedValue(new Error("Database error"));

      await expect(
        TodoService.deleteTodo("test-session-id", "1")
      ).rejects.toThrow("Database error");
    });
  });
});
