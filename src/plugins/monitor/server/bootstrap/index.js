"use strict";

const _ = require("lodash");
const grantConfig = require("./grant-config");

const initGrant = async (pluginStore) => {
  const prevGrantConfig = (await pluginStore.get({ key: "grant" })) || {};

  if (
    !prevGrantConfig ||
    !_.isEqual(_.keys(prevGrantConfig), _.keys(grantConfig))
  ) {
    // merge with the previous provider config.
    _.keys(grantConfig).forEach((key) => {
      if (key in prevGrantConfig) {
        grantConfig[key] = _.merge(grantConfig[key], prevGrantConfig[key]);
      }
    });
    await pluginStore.set({ key: "grant", value: grantConfig });
  }
};

module.exports = async ({ strapi }) => {
  const pluginStore = strapi.store({ type: "plugin", name: "monitor" });

  await initGrant(pluginStore);
};
