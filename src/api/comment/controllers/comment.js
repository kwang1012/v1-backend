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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return this.transformResponse(results);
  },
  async create(ctx) {
    ctx.query = {
      ...ctx.query,
      "populate[0]": "parent",
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
