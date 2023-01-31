"use strict";

/**
 *  service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("plugin::monitor.todo", {
  async count() {
    return await strapi.query("plugin::monitor.todo").count();
  },
});
