"use strict";
const axios = require("axios");
const moment = require("moment");

module.exports = ({ strapi }) => ({
  async getToken() {
    const providers = await strapi
      .store({ type: "plugin", name: "monitor", key: "grant" })
      .get();
    return providers.repo.key;
  },
  async getSavedRepos() {
    const providers = await strapi
      .store({ type: "plugin", name: "monitor", key: "grant" })
      .get();
    return providers.repo.repos;
  },
  async getRepos() {
    const token = await this.getToken();
    return axios
      .get("https://api.github.com/users/kwang1012/repos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => data);
  },
  async getBranches() {
    const token = await this.getToken();
    return axios
      .get("https://api.github.com/repos/kwang1012/v1-backend/branches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => data);
  },
  async getCommit(ctx) {
    const token = await this.getToken();
    return axios
      .get(
        `https://api.github.com/repos/kwang1012/v1-backend/commits/${ctx.params.sha}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => data)
      .catch(() => {});
  },
  async getCommits(ctx) {
    const token = await this.getToken();
    const today = moment();
    const since = today.startOf("week").toISOString();
    return axios
      .get("https://api.github.com/repos/kwang1012/v1-backend/commits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          since: ctx.query.type === "week" ? since : undefined,
        },
      })
      .then(async ({ data: commits }) => {
        if (ctx.query.type !== "week") return commits;
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
  async getLoCUpdated(ctx) {
    const commits = await this.getCommits(ctx);
    return commits.reduce(
      (prev, curr) => {
        return {
          total: prev.total + curr.stats.total,
          additions: prev.additions + curr.stats.additions,
          deletions: prev.deletions + curr.stats.deletions,
        };
      },
      { additions: 0, deletions: 0 }
    );
  },
});
