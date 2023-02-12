/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useLocation, useHistory, Switch, Route } from "react-router-dom";
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
  Flex,
  Box,
} from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { BulletList, Apps, Earth, Code } from "@strapi/icons";
import Todo from "../../components/Todo";
import Overview from "../../components/Overview";
import Visitors from "../../components/Visitors";
import Repos from "../../components/Repos";
import createProvidersArray from "../Settings/utils/createProvidersArray";

const Layout = styled(Box)`
  flex: 1;
  min-height: 100vh;
  background: white;
  overflow-x: auto;
  position: relative;
  & > div {
    padding: 24px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
  }
`;

const HomePage = () => {
  const links = [
    {
      id: 1,
      label: "To-Do list",
      icon: <BulletList />,
      to: "/plugins/monitor/todo",
    },
    {
      id: 2,
      label: "Repositories",
      icon: <Code />,
      to: "/plugins/monitor/repos",
    },
    {
      id: 3,
      label: "Visitors",
      icon: <Earth />,
      to: "/plugins/monitor/visitors",
    },
  ];

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === "/plugins/monitor") {
      history.replace({ pathname: "/plugins/monitor/overview" });
    }
  }, [location.pathname]);

  const [providers, setProviders] = useState({});
  const activeProviders = useMemo(
    () =>
      createProvidersArray(providers).filter((provider) => provider.enabled),
    [providers]
  );
  useEffect(() => {
    request("/monitor/providers").then((data) => setProviders(data));
  }, []);
  const getIcon = (provider) => {
    switch (provider.name) {
      case "todo":
        return <BulletList />;
      case "repo":
        return <Code />;
      case "visitor":
        return <Earth />;
    }
    return null;
  };

  return (
    <Flex alignItems="start">
      <SubNav ariaLabel="Monitor sub nav">
        <SubNavHeader label="Monitor" />
        <SubNavSections>
          <SubNavLink
            to="/plugins/monitor/overview"
            exact
            withBullet={location.pathname === "/plugins/monitor/overview"}
            icon={<Apps />}
          >
            Overview
          </SubNavLink>
          <SubNavSection label="Application">
            {activeProviders.map((provider, i) => (
              <SubNavLink
                to={`/plugins/monitor/${provider.name}`}
                withBullet={
                  location.pathname === `/plugins/monitor/${provider.name}`
                }
                icon={getIcon(provider)}
                key={i}
              >
                {provider.name}
              </SubNavLink>
            ))}
          </SubNavSection>
        </SubNavSections>
      </SubNav>
      <Layout>
        <div>
          <Switch>
            <Route path={"/plugins/monitor/todo"} component={Todo} />
            <Route path={"/plugins/monitor/visitor"} component={Visitors} />
            <Route path={"/plugins/monitor/repo"} component={Repos} />
            <Route component={Overview} />
          </Switch>
        </div>
      </Layout>
    </Flex>
  );
};

export default HomePage;
