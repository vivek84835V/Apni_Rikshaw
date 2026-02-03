const express = require("express");
const { validationResult } = require("express-validator");
const captainmodel = require("../model/captain-model");
const captainService = require("../service/captain-service");

module.exports.getcaptain = (req, res) => {
  return res.send("Heey this is captian route");
};

module.exports.registercaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const findemailexist = await captainmodel.findOne({ email });
    if (findemailexist) {
      return res.status(400).json({ message: "Captain Already Exist" });
    }

    const hashpass = await captainmodel.hashpassword(password);

    const CreateCaptain = await captainService.CreateCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashpass,
      color: vehicle.color,
      plate: vehicle.plate,
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
    });

    const token = CreateCaptain.generateToken();

    res.status(200).json({ token, CreateCaptain });
  } catch (err) {
    throw new Error(err);
  }
};
