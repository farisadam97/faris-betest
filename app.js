const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const appRoutes = require("./Routes");
const app = express();

dotenv.config();

app.use(cors());

// Connect to db
require("./Database");

// app.use(logger("dev"));

// parse json from request
app.use(express.json());

// parse body request
app.use(express.urlencoded({ extended: false }));

// middleware for api route that contains all routes
app.use("/api", appRoutes);

module.exports = app;
