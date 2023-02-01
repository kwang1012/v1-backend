"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("plugin::monitor.visitor", {
  async count(ctx) {
    ctx.body = await strapi.plugin("monitor").service("visitor").count();
  },
});
