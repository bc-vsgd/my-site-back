const exifr = require("exifr");

const getGeoLocation = async (url) => {
  const { latitude, longitude } = await exifr.gps(url);
  return { latitude, longitude };
};

module.exports = getGeoLocation;
