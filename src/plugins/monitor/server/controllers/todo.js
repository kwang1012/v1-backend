"use strict";

/**
 *   controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("plugin::monitor.todo", {
  async count(ctx) {
    ctx.body = await strapi.plugin("monitor").service("todo").count();
  },
  async create(ctx) {
    const entry = await strapi.db.query("plugin::monitor.todo").create({
      ...ctx.request.body,
    });
    return this.transformResponse(entry);
  },
  async update(ctx) {
    const entry = await strapi.db.query("plugin::monitor.todo").update({
      ...ctx.request.body,
      where: {
        id: ctx.params.id,
      },
    });
    return this.transformResponse(entry);
  },
});
