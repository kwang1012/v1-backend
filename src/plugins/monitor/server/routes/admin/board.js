"use strict";

module.exports = [
  {
    method: "GET",
    path: "/boards",
    handler: "board.find",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "PUT",
    path: "/boards/:id",
    handler: "board.update",
    config: {
      policies: [],
      auth: false,
    },
  },
];
