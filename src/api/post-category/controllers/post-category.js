"use strict";

/**
 * post-category controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::post-category.post-category",
  ({ strapi }) => ({
    async find() {
      const results = await strapi.db
        .query("api::post-category.post-category")
        .findMany({
          populate: {
            posts: { count: true },
          },
        });
      return this.transformResponse(results);
    },
  })
);
