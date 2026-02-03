const captainmodel = require("../model/captain-model");

module.exports.CreateCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  vehicleType,
  capacity,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !vehicleType ||
    !capacity
  ) {
    throw new Error("All fields are required");
  }

  const captain = await captainmodel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      vehicleType,
      capacity,
    },
  });
  return captain;
};
