const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// const env = require('./env');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send(`Hello from localhost:${PORT}`));

app.post('/webhook', async (req, res) => {
  console.log('hello');
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    let tempPosts;
    let postIdArr = [];
    body.entry.forEach((entry) => {
      // Gets the body of the webhook event
      webHookChanges = entry.changes;
      webHookChanges.forEach((change) => {
        postIdArr.push(change.value.post_id);
      });
    });

    tempPosts = postIdArr.map(async (postId) => {
      const { data } = await axios({
        url: `https://graph.facebook.com/${postId}?access_token=${process.env.FB_LONG_LIVED_ACCESS_TOKEN}`,
        method: 'GET',
      });

      return data;
    });

    const posts = await Promise.all(tempPosts);
    console.log(posts);

    res.status(200).json(posts);
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.FB_APP_ACCESS_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.listen(PORT, () =>
  console.log(`server started at => http://localhost:${PORT}/`)
);
