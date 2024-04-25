const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Password encryption
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
// Models
const Author = require("../../models/visits/Author");
const Visit = require("../../models/visits/Visit");

// Get an author by token
router.get("/visits/author/author", async (req, res) => {
  try {
    const userToken = req.headers.authorization.replace("Bearer ", "");
    const foundAuthor = await Author.find({ token: userToken });
    if (foundAuthor.length > 0) {
      return res
        .status(200)
        .json({ message: "Author found", data: foundAuthor });
    } else {
      return res.status(400).json({ message: "No author with this token" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/visits/author/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Password encryption
    const salt = uid2(16);
    const saltedPassword = password + salt;
    const hash = SHA256(saltedPassword).toString(encBase64);
    const token = uid2(16);
    // Account creation
    // const foundAuthor = await Author.findOne({ token: token });
    const foundAuthor = await Author.findOne({ email: email });
    if (!foundAuthor) {
      const newAuthor = new Author({
        username,
        email,
        hash,
        salt,
        token,
      });
      await newAuthor.save();
      return res
        .status(200)
        .json({ message: "Account created", author: newAuthor });
    } else {
      return res.status(409).json({ message: "Already signed up" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/visits/author/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundAuthor = await Author.findOne({ email: email });
    if (foundAuthor) {
      const { hash, salt } = foundAuthor;
      const saltedPassword = password + salt;
      const newHash = SHA256(saltedPassword).toString(encBase64);
      if (newHash === hash) {
        return res
          .status(200)
          .json({ message: "Author found", author: foundAuthor });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
