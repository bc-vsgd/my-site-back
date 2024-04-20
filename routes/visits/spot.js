const express = require("express");
const router = express.Router();
// Models
const Spot = require("../../models/visits/Spot");
const Visit = require("../../models/visits/Visit");

const getGeoLocation = require("../../utils/getGeoLocation");

// File upload
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const convertToBase64 = require("../../utils/convertToBase64");

router.post("/visit/:id/spot/create", fileUpload(), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const pictures = req.files?.pictures;
    const { id } = req.params;
    const foundVisit = await Visit.findOne({ _id: id });
    // Visit found => new Spot
    if (foundVisit) {
      const catArr = category.split("-");
      const newSpot = new Spot({
        title: title,
        categories: catArr,
        description: description,
        visit: foundVisit,
      });
      // Picture(s)
      if (pictures) {
        // One picture (spot_image)
        if (!Array.isArray(pictures)) {
          const convertedFile = convertToBase64(pictures);
          const sentFile = await cloudinary.uploader.upload(convertedFile, {
            folder: `/visits/spots/${newSpot._id}`,
            public_id: "preview_img",
          });
          newSpot.spot_image = sentFile;
          // Coords
          const { latitude, longitude } = await getGeoLocation(sentFile.url);
          console.log("geolocation: ", latitude);
          console.log("geolocation: ", longitude);
        }
        // Many pictures
        else {
          // Main picture (spot_image)
          const convertedFile = convertToBase64(pictures[0]);
          const sentFile = await cloudinary.uploader.upload(convertedFile, {
            folder: `/visits/spots/${newSpot._id}`,
            public_id: "preview_img",
          });
          newSpot.spot_image = sentFile;
          // Coords
          const { latitude, longitude } = await getGeoLocation(sentFile.url);
          console.log("geolocation: ", latitude);
          console.log("geolocation: ", longitude);
          // Other pictures array (spot_pictures)
          const picsArray = [];
          for (let i = 1; i < pictures.length; i++) {
            const convertedFile = convertToBase64(pictures[i]);
            const sentFile = await cloudinary.uploader.upload(convertedFile, {
              folder: `/visits/spots/${newSpot._id}`,
            });
            picsArray.push(sentFile);
          }
          newSpot.spot_pictures = picsArray;
        }
      }
      // No picture => no Spot
      else {
        return res
          .status(400)
          .json({ message: "There must be at least one picture" });
      }
      // Save + response
      await newSpot.save();
      return res.status(200).json({ "Spot created": newSpot });
    }
    // No visit => no Spot
    else {
      return res
        .status(500)
        .json({ message: "This spot must belong to a visit" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
