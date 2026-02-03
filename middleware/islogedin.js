const express = require("express");
const jwt = require("jsonwebtoken");
const usermodel = require("../model/user-model");
const blacklistTokenModel = require("../model/blacklistToken-model");
const captainmodel = require("../model/captain-model");

module.exports.islogedin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(405).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const user = await usermodel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

module.exports.islogedincap = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(405).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const captain = await captainmodel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;
    return next();
  } catch (err) {
    res.status(400).json({ messag: "unauthorized", err: err.message });
  }
};
