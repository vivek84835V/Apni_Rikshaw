const express = require("express");

const fareRates = {
  auto: { base: 20, perkm: 10, perMin: 1.5 },
  car: { base: 50, perkm: 15, perMin: 2 },
  motorcycle: { base: 10, perkm: 5, perMin: 1 },
};

function calculateFare(req,res) {

    try{
         const distanceInkm = parseFloat(req.query.distance);
    const timeInMin = parseFloat(req.query.time);

    if (isNaN(distanceInkm) || isNaN(timeInMin)) {
        return res.status(400).json({ error: "Invalid distance or time provided." });
    }

    const fares = {};

  for (const type in fareRates) {
    const rate = fareRates[type];

    fares[type] = Math.round(
      rate.base + (distanceInkm * rate.perkm) + (timeInMin * rate.perMin)
    );
  }
  return res.status(200).json(fares);
    }catch(error)
    {
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = { calculateFare };
