import * as mongoose from 'mongoose';
import { userSchema } from './database/userSchema';
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let UserDoc = mongoose.model('User', userSchema);

/**
 *
 * @param input The username to create for the user
 * @param done Callback function to complete request
 * @returns A UserDoc document
 */
export const createAndSaveUser = async (input, done) => {
  const userEntity = {
    username: input,
  };

  const newUser = new UserDoc(userEntity);
  try {
    const result = await UserDoc.findOne({ username: input });
    if (result) {
      throw new Error(`User already exists for username ${input}`);
    }

    newUser.save((err, data) => {
      if (err) return done(err);
      done(null, data);
    });
  } catch (error) {
    console.error(error);
    return done(error);
  }
};
