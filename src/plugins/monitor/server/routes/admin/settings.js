"use strict";

module.exports = [
  {
    method: "GET",
    path: "/providers",
    handler: "settings.getProviders",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "PUT",
    path: "/providers",
    handler: "settings.updateProviders",
    config: {
      policies: [],
      auth: false,
    },
  },
];
