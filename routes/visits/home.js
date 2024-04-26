const express = require("express");
const router = express.Router();
// Models
const Visit = require("../../models/visits/Visit");

// GET: Get all visits
router.get("/visits", async (req, res) => {
  try {
    const foundVisits = await Visit.find().populate("author");
    if (foundVisits.length !== 0) {
      return res.status(200).json({ message: "Home page", data: foundVisits });
    } else {
      return res.status(200).json({ message: "Home page, no visits for now" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Get visits by author id
router.get("/visits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundVisits = await Visit.find().populate("author");
    if (foundVisits) {
      const authorVisits = [];
      const otherVisits = [];
      for (let i = 0; i < foundVisits.length; i++) {
        const visit = foundVisits[i];
        if (visit.author._id.toString() === id) {
          authorVisits.push(visit);
        } else {
          otherVisits.push(visit);
        }
      }
      return res.status(200).json({
        message: "Home page",
        foundVisits: foundVisits,
        authorVisits: authorVisits,
        otherVisits: otherVisits,
      });
    }
    // No visit
    else {
      return res.status(200).json({ message: "Home page, no visit for now" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
