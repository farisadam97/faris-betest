const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const appRoutes = require("./Route");
const database = require("./Database");
const app = express();

dotenv.config();

app.use(database);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", appRoutes);

module.exports = app;
