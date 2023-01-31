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
    {
      method: "GET",
      path: "/todos/:id",
      handler: "todo.findOne",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/todos",
      handler: "todo.create",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/todos/:id",
      handler: "todo.update",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "DELETE",
      path: "/todos/:id",
      handler: "todo.delete",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
