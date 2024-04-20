const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGODB_URI_VISITS}pics-visits`);

const Visit = mongoose.model("Visit", {
  title: String,
  city: String,
  city_details: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

module.exports = Visit;
