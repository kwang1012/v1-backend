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
  ],
};
