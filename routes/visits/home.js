const express = require("express");
const router = express.Router();
// Models
const Visit = require("../../models/visits/Visit");

router.get("/visits", async (req, res) => {
  try {
    const foundVisits = await Visit.find();
    if (foundVisits.length !== 0) {
      return res.status(200).json({ message: "Home page", data: foundVisits });
    } else {
      return res.status(200).json({ message: "Home page, no visits for now" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
