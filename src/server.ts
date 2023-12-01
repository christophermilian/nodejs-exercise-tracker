import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { AddressInfo } from 'net';
import * as bodyParser from 'body-parser';
import * as exercise from './exercise-service';
import { config } from 'dotenv';

const app = express();
config();

// server configurations

// Some legacy browsers hang on 204 status code
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
const TIMEOUT = 10000;

// middleware

/**
 * Middleware function to log request information
 */
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path} -${req.ip}`);
  next();
});

// routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/**
 * POST with form data 'username' to create a new user.
 */
app.post('/api/users', (req: Request, res: Response, next) => {
  const { username } = req.body;

  // in case of incorrect function use wait timeout then respond
  let t = setTimeout(() => {
    next({ message: 'timeout' });
  }, TIMEOUT);

  exercise.createAndSaveUser(username, (err, data) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log('Missing `done()` argument');
      return next({ message: 'Missing callback argument' });
    }
    const response = {
      username: data.username,
      _id: data._id,
    };
    res.json(response);
  });

  /**
   * Example response structure:
   *  {
   *    username: "chrismilian",
   *    _id: "6567ae62840e130013a1fefd"
   *  }
   */
});

/**
 * GET to /api/users to get a list of all users.
 */
app.get('/api/users', (req: Request, res: Response, next) => {
  // in case of incorrect function use wait timeout then respond
  let t = setTimeout(() => {
    next({ message: 'timeout' });
  }, TIMEOUT);

  exercise.findAllUsers((err, data) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log('Missing `done()` argument');
      return next({ message: 'Missing callback argument' });
    }
    res.json(data);
  });
  /**
   * Example response structure:
   * {
   *   username: "fcc_test",
   *   _id: "5fb5853f734231456ccb3b05"
   * }
   */
});

/**
 * GET to /api/users/:_id/logs to retrieve a full exercise
 * log of any user.
 * i.e. /api/users/6567ae62840e130013a1fefd/logs?
 */
app.get('/api/users/:_id/logs', (req: Request, res: Response, next) => {
  const userId = req.params._id;

  const filters = {
    from: req.query.from ? (req.query.from as string) : null,
    to: req.query.to ? (req.query.to as string) : null,
    limit: req.query.limit ? parseInt(req.query.limit[0]) : 0,
  };

  let t = setTimeout(() => {
    next({ message: 'timeout' });
  }, TIMEOUT);

  exercise.getUserExerciseLogs(userId, filters, (err, data) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log('Missing `done()` argument');
      return next({ message: 'Missing callback argument' });
    }
    res.json(data);
  });

  /**
   * Example response structure:
   * {
   *   username: "fcc_test",
   *   count: 1,
   *   _id: "5fb5853f734231456ccb3b05",
   *   log: [{
   *     description: "test",
   *     duration: 60,
   *     date: "Mon Jan 01 1990",
   *   }]
   * }
   */
});

/**
 * POST to /api/users/:_id/exercises with form
 * data 'description', 'duration', and optionally 'date'.
 * If no date is supplied, the current date will be used.
 */
app.post('/api/users/:_id/exercises', (req: Request, res: Response, next) => {
  const userId = req.params._id;
  const exerciseInput = {
    userId: userId,
    description: req.body.description,
    duration: req.body.duration,
    dateString: req.body.date ? req.body.date : new Date().toDateString(),
  };

  let t = setTimeout(() => {
    next({ message: 'timeout' });
  }, TIMEOUT);

  exercise.createAndSaveExercise(exerciseInput, (err, data) => {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log('Missing `done()` argument');
      return next({ message: 'Missing callback argument' });
    }
    res.json(data);
  });

  /*
   * Example response structure
   * {
   *   username: "fcc_test",
   *   description: "test",
   *   duration: 60,
   *   date: "Mon Jan 01 1990",
   *   _id: "5fb5853f734231456ccb3b05"
   * }
   */
});

const listener = app.listen(process.env.PORT || 3000, () => {
  const { port } = listener.address() as AddressInfo;
  console.log('Your app is listening on port ' + port);
});
