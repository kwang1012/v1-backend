module.exports = {
  type: "admin",
  routes: [
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
      path: "/github/loc",
      handler: "github.getLoCUpdated",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
