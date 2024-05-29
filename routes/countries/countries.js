const express = require("express");
const axios = require("axios");
const router = express.Router();

const countriesUrl = process.env.COUNTRIES_API_URL;

// GET
// All countries, alphabetical sort
router.get("/countries", async (req, res) => {
  try {
    // data: countries array
    const { data } = await axios.get(`${countriesUrl}/all`);
    // alphabetical sort
    const sortedData = data.sort((a, b) => {
      return a.name.common.localeCompare(b.name.common);
    });

    return res.status(200).json({
      message: "Home page",
      data: sortedData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET
// Countries sorted by name, population or area
router.get("/countries/sort", async (req, res) => {
  // Get the values of query params
  const { name, pop, area } = req.query;

  // Sort by name, population or area
  if (name || pop || area) {
    try {
      const { data } = await axios.get(`${countriesUrl}/all`);
      // Sort by name
      if (name) {
        if (name === "asc") {
          const sortedData = data.sort((a, b) => {
            return a.name.common.localeCompare(b.name.common);
          });
          return res
            .status(200)
            .json({ message: "Countries sort by name: asc", data: sortedData });
        } else if (name === "desc") {
          const sortedData = data.sort((a, b) => {
            return b.name.common.localeCompare(a.name.common);
          });
          return res.status(200).json({
            message: "Countries sort by name: desc",
            data: sortedData,
          });
        }
      }
      // Sort by population
      if (pop) {
        if (pop === "asc") {
          const sortedData = data.sort((a, b) => {
            return a.population - b.population;
          });
          return res
            .status(200)
            .json({ message: "Countries sort: asc", data: sortedData });
        } else if (pop === "desc") {
          const sortedData = data.sort((a, b) => {
            return b.population - a.population;
          });
          return res
            .status(200)
            .json({ message: "Countries sort: desc", data: sortedData });
        }
      }
      // Sort by area
      if (area) {
        if (area === "asc") {
          const sortedData = data.sort((a, b) => {
            return a.area - b.area;
          });
          return res.status(200).json({
            message: "Countries: sort by area: asc",
            data: sortedData,
          });
        } else if (area === "desc") {
          const sortedData = data.sort((a, b) => {
            return b.area - a.area;
          });
          return res.status(200).json({
            message: "Countries: sort by area: desc",
            data: sortedData,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  // if no query params
  return res.status(200).json({ message: "Countries sort: no query" });
});

// GET
// Countries searched by name, continent, language
router.get("/countries/search", async (req, res) => {
  // Get the values of query params
  const { namesearch, cont, lang, curr } = req.query;
  if (namesearch) {
    try {
      const { data } = await axios.get(`${countriesUrl}/name/${namesearch}`);
      return res
        .status(200)
        .json({ message: "Countries searched by name", data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  if (cont) {
    try {
      const { data } = await axios.get(`${countriesUrl}/region/${cont}`);
      return res
        .status(200)
        .json({ message: "Countries searched by continent", data: data });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  if (lang) {
    try {
      const { data } = await axios.get(`${countriesUrl}/lang/${lang}`);
      return res.status(200).json({
        message: `Countries searched by language: ${lang}`,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  if (curr) {
    try {
      const { data } = await axios.get(`${countriesUrl}/currency/${curr}`);
      return res.status(200).json({
        message: `Countries searched by currency: ${curr}`,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
});

// GET
// One country
router.get("/country/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { data } = await axios.get(
      `${countriesUrl}/name/${name}?fullText=true`
    );
    return res.status(200).json({ message: `One country: ${name}`, data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
