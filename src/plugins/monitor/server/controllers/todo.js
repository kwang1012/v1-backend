"use strict";

/**
 *   controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("plugin::monitor.todo", {
  async count(ctx) {
    ctx.body = await strapi.plugin("monitor").service("todo").count();
  },
});
