"use strict";
const axios = require("axios");
const moment = require("moment");

module.exports = ({ strapi }) => ({
  async getCommits() {
    const today = moment();
    const since = today.startOf("week").toISOString();
    const token = process.env.GITHUB_TOKEN;
    return axios
      .get("https://api.github.com/repos/kwang1012/v1-backend/commits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          since,
        },
      })
      .then(async ({ data: commits }) => {
        const detailedCommits = await Promise.all(
          commits.map(async (commit) => {
            return axios
              .get(
                `https://api.github.com/repos/kwang1012/v1-backend/commits/${commit.sha}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(({ data }) => data)
              .catch(() => {});
          })
        );
        return detailedCommits;
      })
      .catch(() => []);
  },
  async getLoCUpdated() {
    const commits = await this.getCommits();
    return commits.reduce(
      (prev, curr) => {
        const stats = curr.files.reduce(
          (sum, cur) => ({
            additions: sum.additions + cur.additions,
            deletions: sum.deletions + cur.deletions,
          }),
          { additions: 0, deletions: 0 }
        );
        return {
          additions: prev.additions + stats.additions,
          deletions: prev.deletions + stats.deletions,
        };
      },
      { additions: 0, deletions: 0 }
    );
  },
});
