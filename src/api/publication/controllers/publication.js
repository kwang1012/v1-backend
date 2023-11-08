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
            knex.raw(`json_arrayagg(
              json_object(
                "id", id,
                "title", title,
                "venue", venue,
                "url", url,
                "abstract", abstract,
                "bib", bib,
                "author_list", author_list,
                "date", date,
		"image", image
              )
            ) pubs, year(date) year`)
          )
          .groupBy("year")
          .orderBy("year", "desc");
	results.forEach(result => result.pubs = JSON.parse(result.pubs));
	return camelize(results);
        // return this.transformResponse(camelize(results));
      } else {
        return super.find(ctx);
      }
    },
  })
);
