require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "https://site--home--r6xgg7xm7vcz.code.run" }));
// Countries routes
const countriesRoutes = require("./routes/countries/countries");
app.use(countriesRoutes);

app.all("*", (req, res) => {
  return res.status(400).json({ message: "This page does not exist" });
});

app.listen(3000, () => {
  console.log("Server started !!!");
});
