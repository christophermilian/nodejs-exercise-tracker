import { connect, model } from 'mongoose';
import { userSchema, UserInterface } from './database/userSchema';
import { ExerciseInput, Logs, LogsOptions } from './types';
import { exerciseSchema, ExerciseInterface } from './database/exerciseSchema';
import { format } from 'date-fns';
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
      return done(null, response);
    });
  } catch (error) {
    console.error(error);
    return done(error);
  }
};

/**
 *
 * @param input The user id
 * @param done Callback function to complete request
 * @returns The user info with their exercise logs
 */
export const getUserExerciseLogs = async (
  input: string,
  options: LogsOptions,
  done: Function,
): Promise<Logs> => {
  try {
    const userId = input;
    const filterFrom = options.from
      ? options.from
      : format(new Date(0), 'yyyy-MM-dd');

    const filter =
      options.to == null
        ? { date: { $gt: filterFrom } }
        : { date: { $gt: filterFrom, $lt: options.to } };

    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User does not exists for id ${userId}`);
    }
    const exercises = await Exercise.find(filter, (err) => {
      if (err) return done(err);
    }).limit(options.limit);

    const response = {
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toDateString(),
        };
      }),
    };
    return done(null, response);
  } catch (error) {
    console.error(error);
    return done(error);
  }
};
