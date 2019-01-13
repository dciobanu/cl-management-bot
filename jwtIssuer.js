const jwt = require('jsonwebtoken');
const logEvent = require('./sparkLog.js');

const jwt_iss = process.env.JWT_ISS;
const jwt_key = Buffer.from(process.env.JWT_KEY, 'base64');

async function getJwtForSub(req, res) {
  var tokenJson = {
    iss: jwt_iss,
    sub: req.params.sub,
    name: "Guest User",
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };

  res.send({token: jwt.sign(tokenJson, jwt_key)});
}

async function createJwtForSubName(req, res) {
  const { sub, name } = req.body;

  var tokenJson = {
    iss: jwt_iss,
    sub: sub,
    name: name,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };

  res.send({token: jwt.sign(tokenJson, jwt_key)});
}

module.exports = {
  getJwtForSub: getJwtForSub,
  createJwtForSubName: createJwtForSubName
};
