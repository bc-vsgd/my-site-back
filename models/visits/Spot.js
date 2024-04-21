const mongoose = require("mongoose");
// mongoose.connect(`${process.env.MONGODB_URI_VISITS}pics-visits`);

const Spot = mongoose.model("Spot", {
  title: String,
  categories: [String],
  description: String,
  // Main picture (preview)
  spot_image: Object,
  // All pictures
  spot_pictures: [Object],
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
  },
});

module.exports = Spot;
