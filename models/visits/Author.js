const mongoose = require("mongoose");

// Local
// const dbVisits = mongoose.createConnection(
//   `${process.env.MONGODB_URI_VISITS}visits`
// );

// Remote
const dbVisits = mongoose.createConnection(`${process.env.MONGODB_URI}visits`);

const authorSchema = mongoose.Schema({
  username: String,
  email: String,
  hash: String,
  salt: String,
  token: String,
});

const Author = dbVisits.model("Author", authorSchema);

module.exports = Author;
