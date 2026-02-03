const express = require("express");
const router = express.Router();
const capController = require("../controller/captain-controller");
const { body } = require("express-validator");
const middleware = require("../middleware/islogedin");

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("FirstName must be at least 3 characters long"),
    body("fullname.lastname")
      .isLength({ min: 3 })
      .withMessage("LastName must be at least 3 characters long"),
    body("email").isEmail().withMessage("please enter the valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Invalid select one"),
  ],
  capController.registercaptain,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("please enter the valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  capController.loginCaptain,
);

router.get("/profile", middleware.islogedincap, capController.profileCaptain);

router.get("/logout", middleware.islogedincap, capController.logoutCaptain);

module.exports = router;
