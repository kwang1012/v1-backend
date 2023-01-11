"use strict";

const moment = require("moment");

/**
 * post-category controller
 */

module.exports = {
  async sample() {
    return strapi.plugin("email").service("email").send({
      from: "no-reply@kwang.cc",
      to: "bruce1198@gmail.com",
      subject: "KKAPP mail server test",
      text: "Hello Kai-Siang, \n\nThis is an email for testing our mail server. If you do not want to receive the email, please contact contact@kwang.cc, thnaks!",
    });
  },
  async onMessage(ctx) {
    const from = ctx.header.from;
    const { event, entry, model } = ctx.request.body;
    if (
      from === "admin" &&
      event == "entry.create" &&
      entry &&
      model === "message"
    ) {
      return strapi
        .plugin("email-designer")
        .service("email")
        .sendTemplatedEmail(
          {
            to: "bruce1198@gmail.com",
            from: "notification@kwang.cc",
            replyTo: "reply@kwang.cc",
            attachments: [],
          },
          {
            templateReferenceId: 1,
            subject: `[KKapp] Admin sent you a message`,
          },
          {
            message: {
              ...entry,
              createdAt: moment(entry.createdAt).format("MMMM Do [at] h:mm A"),
            },
          }
        );
    }
    return "";
  },
};
