"use strict";

const _ = require("lodash");

module.exports = {
  async getProviders(ctx) {
    const providers = await strapi
      .store({ type: "plugin", name: "monitor", key: "grant" })
      .get();
    ctx.send(providers);
  },

  async updateProviders(ctx) {
    if (_.isEmpty(ctx.request.body)) {
      throw new ValidationError("Request body cannot be empty");
    }

    await strapi
      .store({ type: "plugin", name: "monitor", key: "grant" })
      .set({ value: ctx.request.body.providers });

    ctx.send({ ok: true });
  },
};
