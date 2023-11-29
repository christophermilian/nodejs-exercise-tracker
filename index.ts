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
})

// routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/**
 * POST with form data 'username' to create a new user.
*/
app.post('/api/users', (req, res) => {
  res.json({});
});

/**
 * GET to /api/users to get a list of all users.
 */
app.get('/api/users', (req, res) => {
  res.json({});
});

/**
 * GET to /api/users/:_id/logs to retrieve a full exercise 
 * log of any user.
 */
app.get('/api/users/:_id/logs', (req, res) => {
  res.json({});
});

/**
 * POST to /api/users/:_id/exercises with form 
 * data 'description', 'duration', and optionally 'date'. 
 * If no date is supplied, the current date will be used.
 */
app.post('/api/users/:_id/exercises', (req, res) => {
  res.json({});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  const { port } = listener.address() as AddressInfo
  console.log('Your app is listening on port ' + port);
});
