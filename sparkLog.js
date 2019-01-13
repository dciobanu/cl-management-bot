const spark = require('ciscospark/env');

module.exports = function logEvent(txt) {
  return spark.messages.create({
    text: txt,
    toPersonEmail: 'dciobanu@cisco.com'
  });
}
