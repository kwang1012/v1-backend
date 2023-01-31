"use strict";

module.exports = ({ strapi, env }) => ({
  getCommits(ctx) {
    console.log(evn);
    return strapi.plugin("monitor").service("myService").getWelcomeMessage();
  },
});
