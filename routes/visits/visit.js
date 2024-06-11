const express = require("express");
const router = express.Router();

const Visit = require("../../models/visits/Visit");
const Author = require("../../models/visits/Author");
const Spot = require("../../models/visits/Spot");

// POST: Create a visit (title ...)
router.post("/visits/visit/create", async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log("token: ", token);
    const foundAuthor = await Author.findOne({ token: token });
    // Bad token
    if (!foundAuthor) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Token found => new Visit with authenticated Author
    else {
      const { title, city, city_details, description } = req.body;
      const newVisit = new Visit({
        title,
        city,
        city_details,
        description,
        author: foundAuthor,
      });
      await newVisit.save();

      return res.status(200).json({
        message: "Visit created",
        author: foundAuthor,
        visit: newVisit,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Get a visit by id
router.get("/visits/visit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundVisit = await Visit.find({ _id: id }).populate("author");
    if (foundVisit.length > 0) {
      // console.log("visit by id, found visit: ", foundVisit);
      return res.status(200).json({ message: "Visit found", data: foundVisit });
    } else {
      return res.status(400).json({ message: "No visit found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET: Get spots by visit id
router.get("/visit/:id/spots", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("id: ", id);
    const foundSpots = await Spot.find()
      .populate("visit", "_id")
      .find({ visit: { _id: id } });
    if (foundSpots.length === 0) {
      return res.status(400).json({ message: "No spot for this visit" });
    }
    return res.status(200).json({ message: "Spots found", data: foundSpots });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT: Update a visit (title ...) by id
router.put("/visits/visit/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, city, details, description } = req.body;
    const token = req.headers.authorization.replace(`Bearer `, "");
    const foundAuthor = await Author.findOne({ token: token });
    if (!foundAuthor) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Token => author found
    else {
      const foundVisit = await Visit.findById(id);
      if (!foundVisit) {
        return res.status(400).json({ message: "This visit does not exist" });
      }
      // Visit found
      else {
        if (title) {
          foundVisit.title = title;
        }
        if (city) {
          foundVisit.city = city;
        }
        if (details) {
          foundVisit.city_details = details;
        }
        if (description) {
          foundVisit.description = description;
        }
        await foundVisit.save();
        return res
          .status(200)
          .json({ message: "Visit updated", data: foundVisit });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a visit by id
router.delete("/visits/visit/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await Visit.findByIdAndDelete(id);
    return res.status(200).json({ message: "Visit successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: message.error });
  }
});
module.exports = router;
