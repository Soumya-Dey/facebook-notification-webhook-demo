const express = require('express');
const axios = require('axios');
const cors = require('cors');

const env = require('./env');

const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Hello from localhost:5000'));

app.listen(5000, () =>
  console.log('server started at => http://localhost:5000/')
);
