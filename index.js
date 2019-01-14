const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const demoRoom = require('./demoRoom.js');
const jwtIssuer = require('./jwtIssuer.js');
const guest = require('./guest.js');

const app = express();

app.use(bodyParser.json({ strict: false }));
app.use(nocache());

const bot_id = process.env.BOT_ID;
const bot_token = process.env.BOT_TOKEN;

app.get('/v1/demoRoom', demoRoom.get);
app.post('/v1/demoRoom', demoRoom.addMember);

app.get('/v1/jwtToken/:sub', jwtIssuer.getJwtForSub);
app.post('/v1/jwtToken', jwtIssuer.createJwtForSubName);

app.post('/v1/guest', guest.createAndJoin);

module.exports.handler = serverless(app);
