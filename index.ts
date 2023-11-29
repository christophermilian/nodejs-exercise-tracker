import * as express from 'express'
import * as cors from 'cors'
import { AddressInfo } from 'net';
import * as bodyParser from 'body-parser';
require('dotenv').config();

const app = express();

// configurations
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware

/**
 * Middleware function to log request information
 */
app.use((req,res,next)=>{
  console.log(`${req.method} ${req.path} -${req.ip}`)
  next()
});

// routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/**
 * POST with form data 'username' to create a new user.
*/
app.post('/api/users', (req, res) => {
  res.json({});
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
app.get('/api/users', (req, res) => {
  res.json({});
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
app.get('/api/users/:_id/logs', (req, res) => {
  res.json({});
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
app.post('/api/users/:_id/exercises', (req, res) => {
  res.json({});
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
  const { port } = listener.address() as AddressInfo
  console.log('Your app is listening on port ' + port);
});
