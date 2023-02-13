"use strict";

const moment = require("moment");
const _ = require("lodash");

/**
 * post-category controller
 */

module.exports = {
  async getLayout(ctx) {
    const layout = await strapi
      .store({ type: "core", name: "admin", key: "layout" })
      .get();
    ctx.send(layout);
  },
  async updateLayout(ctx) {
    if (_.isEmpty(ctx.request.body)) {
      throw new ValidationError("Request body cannot be empty");
    }

    await strapi
      .store({ type: "core", name: "admin", key: "layout" })
      .set({ value: ctx.request.body.layout });

    ctx.send({ ok: true });
  },
};
