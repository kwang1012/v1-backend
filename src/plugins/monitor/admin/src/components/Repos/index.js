import React, { useEffect, useState } from "react";
import { Select, Option, Box } from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { Switch, Route } from "react-router-dom";
import CommitList from "./CommitList";
import Detail from "./Details";

function Main() {
  return <div>123</div>;
}

export default function Repos() {
  return (
    <>
      <Switch>
        {/* <Route path="/plugins/monitor/repo" component={Main} exact /> */}
        <Route path="/plugins/monitor/repo" component={CommitList} exact />
        <Route path="/plugins/monitor/repo/:sha" component={Detail} />
      </Switch>
    </>
  );
}
