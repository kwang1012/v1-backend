"use strict";

/**
 * publication controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const _ = require("lodash");

const camelize = (obj) =>
  _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isDate(value)
      ? value.toISOString()
      : _.isObject(value)
      ? camelize(value)
      : value;
  });

module.exports = createCoreController(
  "api::publication.publication",
  ({ strapi }) => ({
    async find(ctx) {
      if (ctx.query.group) {
        const knex = strapi.db.connection;
        const results = await knex("publications")
          .select(
            knex.raw(
              `json_agg(publications.*) as pubs, date_trunc('${ctx.query.group}', date) as year`
            )
          )
          .groupBy("year")
          .orderBy("year", "desc");
        return this.transformResponse(camelize(results));
      } else {
        return super.find(ctx);
      }
    },
  })
);
