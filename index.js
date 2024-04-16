require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// COUNTRIES
const countriesRoutes = require("./routes/countries/countries");
app.use(countriesRoutes);

// VINTED
mongoose.connect(`${process.env.MONGODB_URI}Vinted`);

const vintedHomeRoutes = require("./routes/vinted/home");
const vintedOfferRoutes = require("./routes/vinted/offer");
const vintedUserRoutes = require("./routes/vinted/user");
app.use(vintedHomeRoutes);
app.use(vintedOfferRoutes);
app.use(vintedUserRoutes);

app.all("*", (req, res) => {
  return res.status(400).json({ message: "This page does not exist" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started !!!");
});
