"use strict";

module.exports = [
  // {
  //   method: "GET",
  //   path: "/visitor/count",
  //   handler: "visitor.count",
  //   config: {
  //     policies: [],
  //     auth: false,
  //   },
  // },
  {
    method: "GET",
    path: "/visitors",
    handler: "visitor.find",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/visitors/:id",
    handler: "visitor.findOne",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/visitors",
    handler: "visitor.create",
    config: {
      policies: [],
      auth: false,
    },
  },
];
