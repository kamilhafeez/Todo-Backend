import express from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteItem,
} from "../controllers/todoController";

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteItem);

export default router;
