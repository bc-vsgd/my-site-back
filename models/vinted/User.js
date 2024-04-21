const mongoose = require("mongoose");
const dbVinted = mongoose.createConnection(`${process.env.MONGODB_URI}Vinted`);

const userSchema = mongoose.Schema({
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

const User = dbVinted.model("User", userSchema);

module.exports = User;
