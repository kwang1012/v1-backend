module.exports = {
  routes: [
    {
      method: "GET",
      path: "/comments/count/view",
      handler: "comment.getCount",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/comment/like/view",
      handler: "comment.getLike",
      config: {
        auth: false,
      },
    },
    {
      method: "PATCH",
      path: "/comment/like",
      handler: "comment.like",
      config: {
        auth: false,
      },
    },
    {
      method: "PATCH",
      path: "/comment/unlike",
      handler: "comment.unlike",
      config: {
        auth: false,
      },
    },
  ],
};
