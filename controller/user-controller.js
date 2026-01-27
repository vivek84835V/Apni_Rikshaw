const usermodel = require("../model/user-model");
const userservice = require("../service/user-service");
const { validationResult } = require("express-validator");
const blocklistModel = require("../model/blacklistToken-model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const userhash = await usermodel.hashpassword(password);

    const usercreate = await userservice.CreateUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: userhash,
    });

    const token = usercreate.generatetoken();

    console.log(token);

    res.status(201).json({ token, usercreate });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await usermodel.findOne({ email }).select("+password");

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
  }

  const ismatch = await user.comparepassword(password);

  if (!ismatch) {
    res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generatetoken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.profile = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports.logoutUserr = async (req, res) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.Split(" ")[1];

  await blocklistModel.create({ token });

  res.status(401).json({ message: "Logged Out" });
};
