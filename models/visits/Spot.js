const mongoose = require("mongoose");
const Visit = require("./Visit");
const dbVisits = mongoose.createConnection(
  `${process.env.MONGODB_URI_VISITS}pics-visits`
);

const spotSchema = mongoose.Schema({
  title: String,
  categories: [String],
  description: String,
  link: String,
  // Main picture (preview)
  spot_image: Object,
  // All pictures
  spot_pictures: [Object],
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Visit,
  },
});

const Spot = dbVisits.model("Spot", spotSchema);

module.exports = Spot;
