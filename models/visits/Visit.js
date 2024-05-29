const mongoose = require("mongoose");
const Author = require("./Author");
const dbVisits = mongoose.createConnection(
  `${process.env.MONGODB_URI_VISITS}visits`
);

const visitSchema = mongoose.Schema({
  title: String,
  city: String,
  city_details: String,
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Author,
  },
});

const Visit = dbVisits.model("Visit", visitSchema);

module.exports = Visit;
