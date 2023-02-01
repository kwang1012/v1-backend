import React, { useEffect, useState } from "react";
import { Select, Option, Box } from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { Switch, Route } from "react-router-dom";
import CommitList from "./CommitList";
import Detail from "./Details";

export default function Visitors() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    request("/monitor/github/branches").then((data) => {
      setBranches(data);
      setSelectedBranch(data[0]?.name || "");
    });
  }, []);

  return (
    <>
      <Box width="100px">
        <Select value={selectedBranch}>
          {branches.map((branch) => (
            <Option key={branch.name} value={branch.name}>
              {branch.name}
            </Option>
          ))}
        </Select>
      </Box>
      <Switch>
        <Route path="/plugins/monitor/repos" component={CommitList} exact />
        <Route path="/plugins/monitor/repos/:sha" component={Detail} />
      </Switch>
    </>
  );
}
