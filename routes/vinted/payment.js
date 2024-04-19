const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/vinted/pay", async (req, res) => {
  try {
    const { stripeToken, totalPrice, title } = req.body;
    const chargeObject = await stripe.charges.create({
      amount: totalPrice * 100,
      currency: "eur",
      description: title,
      source: stripeToken,
    });
    return res.status(200).json(chargeObject);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
