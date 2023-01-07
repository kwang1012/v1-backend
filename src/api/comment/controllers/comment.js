"use strict";

/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  async find(ctx) {
    const results = await strapi.db.query("api::comment.comment").findMany({
      where: {
        ...ctx.query,
        parent: ctx.query.parent || null,
      },
      populate: {
        parent: true,
        children: {
          count: true,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return this.transformResponse(results);
  },
  async getLike(ctx) {
    if (!ctx.query.id) return ctx.badRequest("id is missing");
    const results = await strapi.db
      .connection("comments")
      .select("like")
      .where("id", "=", ctx.query.id);
    return results[0].like;
  },
  async like(ctx) {
    if (!ctx.query.id) return ctx.badRequest("id is missing");
    if (this.getLike(ctx) === Number.MAX_SAFE_INTEGER)
      return Number.MAX_SAFE_INTEGER;
    const count = await strapi.db
      .connection("comments")
      .where("id", "=", ctx.query.id)
      .increment("like", 1);
    return count;
  },
  async unlike(ctx) {
    if (!ctx.query.id) return ctx.badRequest("id is missing");
    if (this.getLike(ctx) === 0) return 0;
    const count = await strapi.db
      .connection("comments")
      .where("id", "=", ctx.query.id)
      .decrement("like", 1);
    return count;
  },
  async create(ctx) {
    ctx.query = {
      ...ctx.query,
      "populate[0]": "parent",
      "populate[1]": "children",
    };
    const entity = await super.create(ctx);
    const parentEmail = entity.data.attributes.parent?.data.attributes.email;
    const parentName = entity.data.attributes.parent?.data.attributes.name;
    const email = entity.data.attributes.email;

    // send email
    if (parentEmail && parentEmail !== email) {
      strapi
        .plugin("email")
        .service("email")
        .send({
          from: "no-reply@kwang.cc",
          to: parentEmail,
          subject: "Someone replies your comment",
          text: `Hello ${parentName}, \n\nThis is an email for informing you that one of your comments has been replied. If you do not want to receive the email, please contact contact@kwang.cc, thnaks!`,
        })
        .then(() => {})
        .catch(console.log);
    }
    return entity;
  },
  getCount(ctx) {
    return strapi.db.query("api::comment.comment").count({
      where: ctx.query,
    });
  },
}));
