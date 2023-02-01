"use strict";

const visitorRoutes = require("./visitor");

module.exports = {
  type: "content-api",
  routes: [...visitorRoutes],
};
