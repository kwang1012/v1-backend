"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async findOne(ctx) {
    const { id: slug } = ctx.params;
    const entry = await strapi.db.query("api::post.post").findOne({
      where: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        related_posts: true,
        post_category: true,
      },
    });

    return this.transformResponse(entry);
  },
}));
