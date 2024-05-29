const mongoose = require("mongoose");
const Author = require("./Author");

// Local
// const dbVisits = mongoose.createConnection(
//   `${process.env.MONGODB_URI_VISITS}visits`
// );

// Remote
const dbVisits = mongoose.createConnection(`${process.env.MONGODB_URI}visits`);

const visitSchema = mongoose.Schema({
  title: String,
  city: String,
  city_details: String,
  description: String,
  spot_image: Object,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Author,
  },
});

const Visit = dbVisits.model("Visit", visitSchema);

module.exports = Visit;
