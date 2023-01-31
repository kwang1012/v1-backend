"use strict";

/**
 *  router.
 */

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/todo/count",
      handler: "todo.count",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/todos",
      handler: "todo.find",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
