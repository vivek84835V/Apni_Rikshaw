const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Vehicle Color must be at least 2 characters long"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, " Plate number must be at least characters long"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "auto", "motorcycle"],
    },
    capacity: {
      type: Number,
      required: true,
      minlength: [1, "Capicity must be at least 1 characters long"],
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

captainSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRETKEY, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparepassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashpassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

const captainmodel = mongoose.model("Captain", captainSchema);
module.exports = captainmodel;
