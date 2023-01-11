"use strict";

const fs = require("fs");
const moment = require("moment");
const sharp = require("sharp");

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
      "populate[2]": "post",
    };
    const entity = await super.create(ctx);
    const parentEmail = entity.data.attributes.parent?.data?.attributes?.email;
    const email = entity.data.attributes.email;

    try {
      const comment = entity.data.attributes;
      comment.post = comment.post.data.attributes;
      const avatar_uri = decodeURIComponent(comment.avatar)
        .split(";utf8,")
        .pop();
      const filename = `tmp_${Date.now()}.png`;
      const avatar_64 = await sharp(Buffer.from(avatar_uri, "utf-8"))
        .png()
        .toFile(filename);
      // .toBuffer();

      // const avatar = `data:image/png;base64,${avatar_64.toString("base64")}`;

      // send email
      if (parentEmail && parentEmail !== email) {
        strapi
          .plugin("email-designer")
          .service("email")
          .sendTemplatedEmail(
            {
              to: parentEmail,
              from: "notification@kwang.cc",
              replyTo: "reply@kwang.cc",
              attachments: [
                {
                  filename: "avatar.png",
                  path: filename,
                  cid: "avatar",
                },
              ],
            },
            {
              templateReferenceId: 2,
              subject: `[KKapp] ${comment.name} sent you a message`,
            },
            {
              reply: {
                ...comment,
                createdAt: moment(comment.createdAt).format(
                  "MMMM Do [at] h:mm A"
                ),
              },
            }
          )
          .then(() => {
            fs.unlink(filename, () => {});
          })
          .catch(console.log);
      }
    } catch (e) {
      console.log(e);
    }
    return entity;
  },
  getCount(ctx) {
    return strapi.db.query("api::comment.comment").count({
      where: ctx.query,
    });
  },
}));
