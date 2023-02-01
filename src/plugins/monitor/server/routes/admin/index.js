"use strict";

const githubRoutes = require("./github");
const todoRoutes = require("./todo");
const boardRoutes = require("./board");

module.exports = {
  type: "admin",
  routes: [...githubRoutes, ...todoRoutes, ...boardRoutes],
};
