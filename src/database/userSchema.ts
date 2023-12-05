import { Document, Schema } from 'mongoose';

export interface UserInterface extends Document {
  username: string;
}

export const userSchema = new Schema<UserInterface>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
});
