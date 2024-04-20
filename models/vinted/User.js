const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGODB_URI}Vinted`);

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object, // nous verrons plus tard comment uploader une image
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
