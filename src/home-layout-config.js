"use strict";

module.exports = (
  setting = {
    minW: 0,
    maxW: Number.MAX_SAFE_INTEGER,
    minH: 0,
    maxH: Number.MAX_SAFE_INTEGER,
  }
) => [
  { i: "balance", x: 0, y: 0, w: 3, h: 3, ...setting },
  { i: "todo", x: 3, y: 0, w: 3, h: 3, ...setting },
  { i: "visitor", x: 6, y: 0, w: 3, h: 3, ...setting },
  { i: "loc", x: 9, y: 0, w: 3, h: 3, ...setting },
  { i: "client", x: 0, y: 3, w: 3, h: 3, ...setting },
  { i: "invoice", x: 0, y: 6, w: 3, h: 3, ...setting },
  { i: "revenue", x: 3, y: 3, w: 9, h: 6, ...setting },
  { i: "email", x: 0, y: 9, w: 12, h: 8, ...setting },
];
