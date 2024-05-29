const mongoose = require("mongoose");
const dbVisits = mongoose.createConnection(
  `${process.env.MONGODB_URI_VISITS}visits`
);

const authorSchema = mongoose.Schema({
  username: String,
  email: String,
  hash: String,
  salt: String,
  token: String,
});

const Author = dbVisits.model("Author", authorSchema);

module.exports = Author;
