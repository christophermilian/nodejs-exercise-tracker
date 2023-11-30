import { connect, model } from 'mongoose';
import { userSchema } from './database/userSchema';
require('dotenv').config();

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let UserDoc = model('User', userSchema);

/**
 * Creates and saves a user.
 * @param input The username to create for the user
 * @param done Callback function to complete request
 * @returns A UserDoc document
 */
export const createAndSaveUser = async (input: string, done: Function): Promise<Object> => {
  const userEntity = {
    username: input,
  };

  const newUser = new UserDoc(userEntity);
  try {
    const result: Object = await UserDoc.findOne({ username: input });
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

/**
 * Finds all users.
 * @param done Callbacl function to complete request
 * @returns An array of UserDoc documents
 */
export const findAllUsers = async (done: Function): Promise<Array<Object>> => {
  const result: Array<Object> = await UserDoc.find((err) => {
    if(err) return done(err)
  })
  return done(null, result)
};
