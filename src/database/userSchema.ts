import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});
