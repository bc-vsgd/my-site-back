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

// GET: Get a spot by id
router.get("/visit/spot/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundSpot = await Spot.findOne({ _id: id });
    if (foundSpot) {
      return res.status(200).json({ message: "Spot found", data: foundSpot });
    } else {
      return res.status(400).json({ message: "No spot found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST: Create a spot by visit id
router.post("/visit/:id/spot/create", fileUpload(), async (req, res) => {
  try {
    const { title, categories, description, link } = req.body;
    const pictures = req.files?.pictures;
    const { id } = req.params;
    const foundVisit = await Visit.findOne({ _id: id });
    // Visit found => new Spot
    if (foundVisit) {
      const newSpot = new Spot({
        title: title,
        categories: JSON.parse(categories),
        description: description,
        link: link,
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
          // const { latitude, longitude } = await getGeoLocation(sentFile.url);
          // console.log("geolocation: ", latitude);
          // console.log("geolocation: ", longitude);
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
          // const { latitude, longitude } = await getGeoLocation(sentFile.url);
          // console.log("geolocation: ", latitude);
          // console.log("geolocation: ", longitude);
          //
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

// PUT: Update a spot by its id (NOT visit id)
router.put("/visit/spot/:id/update", fileUpload(), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, categories, description, link } = req.body;
    const picsArray = JSON.parse(req.body.picsArray);
    // console.log("back, update spot, pics array: ", picsArray);
    const pictures = req.files?.pictures;
    const foundSpot = await Spot.findOne({ _id: id });
    // The spot does not exist
    if (!foundSpot) {
      // console.log("! found spot");
      return res.status(400).json({ message: "This spot does not exist" });
    } else {
      // console.log("found spot");
      //
      // The spot exists
      foundSpot.title = title;
      foundSpot.categories = JSON.parse(categories);
      foundSpot.description = description;
      foundSpot.link = link;
      // Reset spot_pictures array
      foundSpot.spot_pictures = [];

      // Picture(s)
      if (
        (Array.isArray(pictures) && pictures.length > 0) ||
        (!Array.isArray(pictures) && pictures) ||
        picsArray.length > 0
      ) {
        console.log("pictures || pics array");
        // if picsArray => [0]: spot_image; others: spot_pictures
        if (picsArray.length > 1) {
          // 1st (or only) picture => spot_image
          foundSpot.spot_image = picsArray[0];
          // If other pictures => spot_pictures
          if (picsArray.length > 1) {
            // console.log("back, update spot,picsArray.length > 1");
            for (let i = 1; i < picsArray.length; i++) {
              foundSpot.spot_pictures.push(picsArray[i]);
            }
          }
          // If files-pictures
          // if (pictures) {
          if (
            (Array.isArray(pictures) && pictures.length > 0) ||
            (!Array.isArray(pictures) && pictures)
          ) {
            console.log("back update spot, pictures");
            // 1 file = {}
            if (!Array.isArray(pictures)) {
              console.log("1 file");
              const convertedFile = convertToBase64(pictures);
              const sentFile = await cloudinary.uploader.upload(convertedFile, {
                folder: `/visits/spots/${foundSpot._id}`,
              });
              foundSpot.spot_pictures.push(sentFile);
            }

            // > 1 file  =[]
            else {
              console.log("many files");
              for (let i = 1; i < pictures.length; i++) {
                const convertedFile = convertToBase64(pictures[i]);
                const sentFile = await cloudinary.uploader.upload(
                  convertedFile,
                  {
                    folder: `/visits/spots/${foundSpot._id}`,
                  }
                );
                foundSpot.spot_pictures.push(sentFile);
              }
            }
          } // fin: if pictures
        } // fin: if (picsArray)
        // If only selected pictures
        else {
          console.log("only pictures files");
          // if 1 picture => spot_image
          if (!Array.isArray(pictures)) {
            const convertedFile = convertToBase64(pictures);
            const sentFile = await cloudinary.uploader.upload(convertedFile, {
              folder: `/visits/spots/${foundSpot._id}`,
              public_id: "preview_img",
            });
            foundSpot.spot_image = sentFile;
          }
          // if many pictures
          else {
            // Main picture (spot_image)
            const convertedFile = convertToBase64(pictures[0]);
            const sentFile = await cloudinary.uploader.upload(convertedFile, {
              folder: `/visits/spots/${foundSpot._id}`,
              public_id: "preview_img",
            });
            foundSpot.spot_image = sentFile;
            // Other pictures array (spot_pictures)
            const array = [];
            for (let i = 1; i < pictures.length; i++) {
              const convertedFile = convertToBase64(pictures[i]);
              const sentFile = await cloudinary.uploader.upload(convertedFile, {
                folder: `/visits/spots/${foundSpot._id}`,
              });
              array.push(sentFile);
            }
            foundSpot.spot_pictures = array;
          }
        } // fin if (pictures only)
      } //fin  if (pictures || picsArray)

      // // if pictures: spot_pictures
      // else: only pictures: [0]: spot image; others: spot_pictures

      // No picture => no Spot
      else {
        console.log("no picture");
        return res
          .status(400)
          .json({ message: "There must be at least one picture" });
      }
      // Save + response
      await foundSpot.save();
      return res
        .status(200)
        .json({ message: "Spot successfully updated !", data: foundSpot });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
