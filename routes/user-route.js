const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const usercontroller = require("../controller/user-controller");
const middleware = require("../middleware/islogedin");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usercontroller.registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usercontroller.loginUser,
);

router.get("/profile", middleware.islogedin, usercontroller.profile);

router.get("/logout", middleware.islogedin, usercontroller.logoutUserr);

module.exports = router;
