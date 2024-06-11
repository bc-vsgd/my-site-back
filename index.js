require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// COUNTRIES
const countriesRoutes = require("./routes/countries/countries");
app.use(countriesRoutes);

// VISITS
const visitHomeRoutes = require("./routes/visits/home");
const visitSpotRoutes = require("./routes/visits/spot");
const visitAuthorRoutes = require("./routes/visits/author");
const visitVisitRoutes = require("./routes/visits/visit");
app.use(visitHomeRoutes);
app.use(visitSpotRoutes);
app.use(visitAuthorRoutes);
app.use(visitVisitRoutes);

// TODOLIST
const tasksRoutes = require("./routes/tasks/tasks");
app.use(tasksRoutes);

// VINTED
const vintedHomeRoutes = require("./routes/vinted/home");
const vintedOfferRoutes = require("./routes/vinted/offer");
const vintedUserRoutes = require("./routes/vinted/user");
const vintedPaymentRoutes = require("./routes/vinted/payment");
app.use(vintedHomeRoutes);
app.use(vintedOfferRoutes);
app.use(vintedUserRoutes);
app.use(vintedPaymentRoutes);

app.all("*", (req, res) => {
  return res.status(400).json({ message: "This page does not exist" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started !!!");
});
