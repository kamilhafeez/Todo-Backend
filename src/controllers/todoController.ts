import { Request, Response } from "express";
import {
  TodoBody,
  TodoService,
  UpdateTodoParams,
} from "../services/todoService";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await TodoService.getTodos(req.sessionID);
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const newTodo = await TodoService.addTodo(req.sessionID, title);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateTodo = async (
  req: Request<UpdateTodoParams, {}, TodoBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedTodo = await TodoService.updateTodo(req.sessionID, id, title);
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const response = await TodoService.deleteTodo(req.sessionID, id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
