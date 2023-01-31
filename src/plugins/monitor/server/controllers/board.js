"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::monitor.board",
  ({ strapi }) => ({
    async find() {
      const results = await strapi.db.query("plugin::monitor.board").findMany({
        populate: {
          todos: true,
        },
      });
      return this.transformResponse(results);
    },
  })
);
