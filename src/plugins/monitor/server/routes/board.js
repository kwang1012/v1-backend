"use strict";

/**
 *  router.
 */

module.exports = {
  type: "admin",
  routes: [
    // {
    //   method: "GET",
    //   path: "/board/count",
    //   handler: "board.count",
    //   config: {
    //     policies: [],
    //     auth: false,
    //   },
    // },
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
  ],
};
