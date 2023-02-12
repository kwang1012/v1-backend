"use strict";

const githubRoutes = require("./github");
const todoRoutes = require("./todo");
const boardRoutes = require("./board");
const settingsRoutes = require("./settings");

module.exports = {
  type: "admin",
  routes: [...githubRoutes, ...todoRoutes, ...boardRoutes, ...settingsRoutes],
};
