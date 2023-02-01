"use strict";

/**
 *  service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("plugin::monitor.visitor", {
  async count() {
    return await strapi.query("plugin::monitor.visitor").count();
  },
});
