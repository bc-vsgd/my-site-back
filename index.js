require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Countries routes
const countriesRoutes = require("./routes/countries/countries");
app.use(countriesRoutes);

// VINTED

// const mongoose = require("mongoose");

// mongoose.connect(`${process.env.MONGODB_URI}Vinted`);
// const Offer = require("./models/vinted/Offer");

// Vinted routes
// const vintedUserRoutes = require("./routes/vinted/user");
// const vintedOfferRoutes = require("./routes/vinted/offer");

// app.use(vintedUserRoutes);
// app.use(vintedOfferRoutes);

// app.get("/vinted", async (req, res) => {
//   try {
//     // offers: objects array
//     const offers = await Offer.find().populate("owner");
//     return res.status(200).json({ offers });
//   } catch (error) {
//     // return res.status(500).json({ message: "Internal server error" });
//     return res.status(500).json({ message: error.message });
//   }
// });

app.all("*", (req, res) => {
  return res.status(400).json({ message: "This page does not exist" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started !!!");
});
