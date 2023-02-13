"use strict";
const moment = require("moment");
const cron = require("node-cron");
const _ = require("lodash");
const getHomeLayoutConfig = require("./home-layout-config");

const initHomeLayout = async (store) => {
  const prevHomeLayoutConfig = (await store.get({ key: "layout" })) || {};

  const homeLayoutConfig = getHomeLayoutConfig();
  if (
    !prevHomeLayoutConfig ||
    !_.isEqual(_.keys(prevHomeLayoutConfig), _.keys(homeLayoutConfig))
  ) {
    // merge with the previous provider config.
    _.keys(homeLayoutConfig).forEach((key) => {
      if (key in prevHomeLayoutConfig) {
        homeLayoutConfig[key] = _.merge(
          homeLayoutConfig[key],
          prevHomeLayoutConfig[key]
        );
      }
    });
    await store.set({ key: "layout", value: homeLayoutConfig });
  }
};

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
  async bootstrap({ strapi }) {
    const store = strapi.store({ type: "core", name: "admin" });

    await initHomeLayout(store);

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
