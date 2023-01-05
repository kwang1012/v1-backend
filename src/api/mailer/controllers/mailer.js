"use strict";

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
};
