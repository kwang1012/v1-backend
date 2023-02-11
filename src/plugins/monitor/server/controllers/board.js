"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::monitor.board",
  ({ strapi }) => ({
    async find() {
      const results = await strapi.db.query("plugin::monitor.board").findMany({
        populate: {
          todos: {
            orderBy: "order",
          },
        },
        orderBy: "order",
      });
      return this.transformResponse(results);
    },
    async updateStatus(ctx) {
      const updatedBoards = ctx.request.body.data;
      const knex = strapi.db.connection;
      const results = knex.transaction((trx) => {
        const queries = [];
        updatedBoards.forEach((board) => {
          const query = knex("boards")
            .where("id", board.id)
            .update({
              order: board.order,
            })
            .transacting(trx);
          queries.push(query);
          board.ts.forEach((todo) => {
            const updateOrder = knex("todos")
              .where("id", todo.id)
              .update({
                order: todo.order,
              })
              .transacting(trx);
            queries.push(updateOrder);
            const updateRelation = knex("todos_board_links")
              .where("todo_id", todo.id)
              .update({
                board_id: todo.bid,
              })
              .transacting(trx);
            queries.push(updateRelation);
          });
        });

        Promise.all(queries) // Once every query is written
          .then(trx.commit) // We try to execute all of them
          .catch(trx.rollback); // And rollback in case any of them goes wrong
      });
      return results;
    },
  })
);
