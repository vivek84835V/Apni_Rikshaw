const express = require("express");
const { validationResult } = require("express-validator");
const captainmodel = require("../model/captain-model");
const captainService = require("../service/captain-service");
const blacklistTokenModel = require("../model/blacklistToken-model");

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

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(401).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainmodel.findOne({ email }).select("+password");

  if (!captain) {
    res.status(400).json({ message: "Invalid Email Password" });
  }

  const ismatch = await captain.comparepassword(password);

  if (!ismatch) {
    res.status(400).json({ message: "Invalid Email Password" });
  }

  const token = await captain.generateToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "Logout Succesfully" });
};

module.exports.profileCaptain = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};
