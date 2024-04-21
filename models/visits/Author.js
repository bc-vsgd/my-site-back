const mongoose = require("mongoose");
// mongoose.connect(`${process.env.MONGODB_URI_VISITS}pics-visits`);

const Author = mongoose.model("Author", {
  username: String,
  email: String,
  hash: String,
  salt: String,
  token: String,
});

module.exports = Author;
