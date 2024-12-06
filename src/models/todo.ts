import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  sessionId: string;
  title: string;
  completed: boolean;
}

const TodoSchema = new Schema<ITodo>({
  sessionId: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
