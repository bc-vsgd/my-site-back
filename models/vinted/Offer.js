const mongoose = require("mongoose");
const User = require("../../models/vinted/User");
const dbVinted = mongoose.createConnection(`${process.env.MONGODB_URI}Vinted`);

const offerSchema = mongoose.Schema({
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  product_pictures: Array,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
});

const Offer = dbVinted.model("Offer", offerSchema);

module.exports = Offer;
