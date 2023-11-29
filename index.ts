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

const listener = app.listen(process.env.PORT || 3000, () => {
  const { port } = listener.address() as AddressInfo
  console.log('Your app is listening on port ' + port);
});
