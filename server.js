const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// const env = require('./env');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => res.send(`Hello from localhost:${PORT}`));

app.listen(PORT, () =>
  console.log(`server started at => http://localhost:${PORT}/`)
);
