const awsSdk = require('aws-sdk');
const spark = require('ciscospark/env');
const logEvent = require('./sparkLog.js');

const dynamoDb = new awsSdk.DynamoDB.DocumentClient();

function getCurDate() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toJSON();
}

async function getRoomId(day) {
  try {
    var dbRecord = await dynamoDb.get({ TableName: 'cl-management-bot', Key: { day: day } }).promise();
    return dbRecord.Item.roomId;
  } catch (e) {
    return null;
  }
}

async function setRoomId(day, value) {
  return await dynamoDb.put({ TableName: 'cl-management-bot', Item: { day: day, roomId: value } }).promise();
}

async function getOrCreateRoom() {
  var curDay = getCurDate();
  var roomId = await getRoomId(curDay);
  if (!roomId) {
    var roomRecord = await spark.rooms.create({ title: 'Demo Space (' + curDay + ')' });
    await setRoomId(curDay, roomRecord.id);
    await logEvent("New space " + roomRecord.id + " created for " + curDay);
    return roomRecord.id;
  } else {
    return roomId;
  }
}

async function get(req, res) {
  const roomId = await getOrCreateRoom();
  res.json({
    version: '2019-01-13 001',
    roomId: roomId
  });
};

async function addMember(req, res) {
  const { userId, userEmail } = req.body;
  const roomId = await getOrCreateRoom();

  if (!userId && !userEmail) {
    res.status(400).json({ error: 'Provide one of the userId or userEmail (not both)' });
  }
  else {
    try {
      await spark.memberships.create({
        roomId: roomId,
        personEmail: userEmail,
        personId: userId
      });

      res.status(204).end();
    } catch (e) {
      console.error("Error", JSON.stringify(e));
      res.status(502).end(JSON.stringify(e));
    }
  }
};

module.exports = {
  get: get,
  addMember: addMember,
  getOrCreateRoom: getOrCreateRoom
};
