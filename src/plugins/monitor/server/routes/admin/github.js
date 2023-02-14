"use strict";

module.exports = [
  {
    method: "GET",
    path: "/github/saved-repos",
    handler: "github.getSavedRepos",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/github/repos",
    handler: "github.getRepos",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/github/branches",
    handler: "github.getBranches",
    config: {
      policies: [],
      auth: false,
    },
  },
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
    path: "/github/commit/:sha",
    handler: "github.getCommit",
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
