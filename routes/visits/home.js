const express = require("express");
const router = express.Router();
// Mongoose
// const mongoose = require("mongoose");
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

router.get("/visits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id: ", id);
    const foundVisits = await Visit.find();

    const authorVisits = await Visit.find()
      .populate("author", "_id")
      .find({ author: { _id: id } });
    if (foundVisits) {
      const otherVisits = [];
      for (let i = 0; i < foundVisits.length; i++) {
        const visit = foundVisits[i];
        console.log("visit id: ", visit._id.toString());
        console.log("author id: ", visit.author._id.toString());
        console.log("params id: ", id);
        if (visit.author._id.toString() === id) {
          console.log("id ok");
        } else {
          console.log("id not ok");
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
