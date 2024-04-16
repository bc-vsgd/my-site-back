const express = require("express");
const router = express.Router();
const Offer = require("../../models/vinted/Offer");

router.get("/vinted", async (req, res) => {
  try {
    // offers: objects array
    const offers = await Offer.find().populate("owner");
    return res.status(200).json({ offers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
