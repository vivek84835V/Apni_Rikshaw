const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const express = require("express");
const cors = require("cors");
const app = express();
require("./db/db");
const userroute = require("./routes/user-route");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userroute);

module.exports = app;
