import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  GridItem,
  Card,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@strapi/design-system";
import { useHistory } from "react-router-dom";
import { request } from "@strapi/helper-plugin";
import { Switch, Route } from "react-router-dom";
import CommitList from "./CommitList";
import Detail from "./Details";
import moment from "moment";

function Main() {
  const history = useHistory();
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    request("/monitor/github/saved-repos").then((data) =>
      setRepos(data.map((d) => JSON.parse(d)))
    );
  }, []);
  return (
    <>
      <Typography variant="beta">Selected repositories</Typography>
      <Grid marginTop={6} gap={3}>
        {repos.map((repo) => (
          <GridItem key={repo.name} col={3}>
            <Card
              paddingLeft={3}
              paddingRight={3}
              paddingTop={2}
              paddingBottom={2}
              style={{ cursor: "pointer" }}
              onClick={() =>
                history.push({
                  pathname: "/plugins/monitor/repo/commits",
                  search: `?repo=${repo.name}`,
                })
              }
            >
              <CardContent>
                <CardTitle> {repo.name}</CardTitle>
                <CardSubtitle style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={repo.owner.avatar_url}
                    width={20}
                    height={20}
                    style={{ borderRadius: "50%", marginRight: 8 }}
                  />
                  {repo.owner.login}
                </CardSubtitle>
                <Typography variant="pi">
                  Last update: {moment(repo.updated_at).format("MMM-DD YYYY")}
                </Typography>
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </>
  );
}

export default function Repos() {
  return (
    <>
      <Switch>
        <Route path="/plugins/monitor/repo" component={Main} exact />
        <Route path="/plugins/monitor/repo/commits" component={CommitList} />
        <Route path="/plugins/monitor/repo/:sha" component={Detail} />
      </Switch>
    </>
  );
}
