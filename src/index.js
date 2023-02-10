"use strict";
const moment = require("moment");
const cron = require("node-cron");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    cron.schedule("30 1 1,15 * *", async () => {
      const results = await strapi.db.query("plugin::monitor.visitor").delete({
        where: {
          createdAt: {
            $lte: moment().subtract(1, "years"),
          },
        },
      });
      console.log(results);
    });
  },
};
