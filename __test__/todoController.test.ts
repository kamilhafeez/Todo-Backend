import { Request, Response } from "express";
import * as todoController from "../src/controllers/todoController";
import { TodoService } from "../src/services/todoService";

jest.mock("../src/services/todoService");

const mockedTodoService = TodoService as jest.Mocked<typeof TodoService>;

describe("Todo Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      sessionID: "test-session-id",
      params: { id: "123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should fetch and return todos for the current user", async () => {
      const mockTodos = [
        { _id: "1", title: "Test Todo 1", completed: false },
        { _id: "2", title: "Test Todo 2", completed: true },
      ];

      mockedTodoService.getTodos.mockResolvedValue(mockTodos as any);

      await todoController.getTodos(req as Request, res as Response);

      expect(mockedTodoService.getTodos).toHaveBeenCalledWith(
        "test-session-id"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTodos);
    });

    it("should handle errors when fetching todos", async () => {
      mockedTodoService.getTodos.mockRejectedValue(new Error("Database error"));

      await todoController.getTodos(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo", async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated Todo" };
      const updatedTodo = { _id: "1", title: "Updated Todo", completed: false };

      mockedTodoService.updateTodo.mockResolvedValue(updatedTodo as any);

      await todoController.updateTodo(req as any, res as Response);

      expect(mockedTodoService.updateTodo).toHaveBeenCalledWith(
        "test-session-id",
        "1",
        "Updated Todo"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it("should handle errors when updating a todo", async () => {
      req.params = { id: "1" };
      req.body = { title: "Updated Todo" };

      mockedTodoService.updateTodo.mockRejectedValue(
        new Error("Database error")
      );

      await todoController.updateTodo(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
