import { connect, model } from 'mongoose';
import { userSchema, UserInterface } from './database/userSchema';
import { ExerciseInput } from './types';
import { exerciseSchema, ExerciseInterface } from './database/exerciseSchema';
require('dotenv').config();

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = model<UserInterface>('User', userSchema);
const Exercise = model<ExerciseInterface>('Exercise', exerciseSchema);

/**
 * Creates and saves a user.
 * @param input The username to create for the user
 * @param done Callback function to complete request
 * @returns A User document
 */
export const createAndSaveUser = async (
  input: string,
  done: Function,
): Promise<Object> => {
  const userEntity = {
    username: input,
  };

  const newUser = new User(userEntity);
  try {
    const result: Object = await User.findOne({ username: input });
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
 * @returns An array of User documents
 */
export const findAllUsers = async (done: Function): Promise<Array<Object>> => {
  const result: Array<Object> = await User.find((err) => {
    if (err) return done(err);
  });
  return done(null, result);
};

/**
 * Creates and saves an exercise for a user.
 * @param input The input requiring userId, description, duration, and date
 * @param done Callback function to complete request
 * @returns An Exercise document
 */
export const createAndSaveExercise = async (
  input: ExerciseInput,
  done: Function,
): Promise<Object> => {
  try {
    const { userId, description, duration, dateString } = input;
    const result = await User.findById(userId);

    if (!result) {
      throw new Error(`User does not exists for id ${userId}`);
    }
    const exerciseEntity = {
      user_id: userId,
      description: description,
      duration: duration,
      date: dateString,
    };
    const newExercise = new Exercise(exerciseEntity);
    newExercise.save((err, data) => {
      if (err) return done(err);
      const response = {
        _id: result._id,
        username: result.username,
        description: data.description,
        duration: data.duration,
        date: new Date(data.date).toDateString(),
      };
      done(null, response);
    });
  } catch (error) {
    console.error(error);
    return done(error);
  }
};
