const jwt = require('jsonwebtoken');
const logEvent = require('./sparkLog.js');
const demoRoom = require('./demoRoom.js');
const rp = require('request-promise');

const bot_id = process.env.BOT_ID;
const bot_token = process.env.BOT_TOKEN;

const jwt_iss = process.env.JWT_ISS;
const jwt_key = Buffer.from(process.env.JWT_KEY, 'base64');

async function createAndJoin(req, res) {
  const { sub, name } = req.body;

  var tokenJson = {
    iss: jwt_iss,
    sub: sub,
    name: name,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };
  
  var tokenJwt = jwt.sign(tokenJson, jwt_key);

  try {
    var roomId = await demoRoom.getOrCreateRoom();

    var loginResponse = await rp({
        method: 'POST',
        uri: 'https://api.ciscospark.com/v1/jwt/login',
        headers: {Authorization: 'Bearer ' + tokenJwt},
        json: true
      });

    var personDetails = await rp({
        method: 'GET',
        uri: 'https://api.ciscospark.com/v1/people/me',
        headers: {Authorization: 'Bearer ' + loginResponse.token},
        json: true
      });

    var membership = await rp({
        method: 'POST',
        uri: 'https://api.ciscospark.com/v1/memberships',
        headers: {Authorization: 'Bearer ' + bot_token},
        body: {roomId: roomId, personId: personDetails.id},
        json: true
      })

    res.send(membership);
  } catch (e) {
    res.status(e.statusCode).send(e.error);
  }
}
  
module.exports = {
  createAndJoin: createAndJoin
};
