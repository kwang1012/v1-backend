"use strict";

module.exports = [
  {
    method: "GET",
    path: "/github/commits",
    handler: "github.getCommits",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/github/loc",
    handler: "github.getLoCUpdated",
    config: {
      policies: [],
      auth: false,
    },
  },
];
