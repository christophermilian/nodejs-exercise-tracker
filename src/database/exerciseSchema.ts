import { Document, Schema } from 'mongoose';

export interface ExerciseInterface extends Document {
  user_id: string;
  description: string;
  duration: number;
  date: string;
}

export const exerciseSchema = new Schema<ExerciseInterface>({
  user_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
