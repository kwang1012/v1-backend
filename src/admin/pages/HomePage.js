import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { LoadingIndicatorPage, request } from "@strapi/helper-plugin";
import { Box } from "@strapi/design-system/Box";
import { Card } from "@strapi/design-system/Card";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { Grid } from "@strapi/design-system/Grid";
import { SimpleMenu, MenuItem } from "@strapi/design-system/SimpleMenu";
import { IconButton } from "@strapi/design-system/IconButton";
import { Table, Tbody, Tr, Td } from "@strapi/design-system/Table";
import { Avatar } from "@strapi/design-system/Avatar";
import More from "@strapi/icons/More";
import ChartPie from "@strapi/icons/ChartPie";
import Briefcase from "@strapi/icons/Briefcase";
import Earth from "@strapi/icons/Earth";
import File from "@strapi/icons/File";
import { useModels } from "../../hooks";
import Sidebar from "components/Sidebar";
import Nav from "components/Nav";
import RevenueChart from "components/RevenueChart";
import { normalize } from "utils";
import { useHistory } from "react-router-dom";
import moment from "moment";

const Layout = styled(Box)`
  height: 100vh;
  box-sizing: box-border;
  position: relative;
`;

const Main = styled(Box)`
  grid-column: span 9;
  height: calc(100vh - 48px);
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MoreVert = styled(More)`
  transform: rotate(90deg);
`;

const GridCard = styled(Card)`
  grid-column: span ${(props) => props.col};
  grid-row: span ${(props) => props.row};
`;

const CustomGridItem = ({ children, ...props }) => {
  return <GridCard {...props}>{children}</GridCard>;
};
const Tag = styled(Box)`
  width: ${(props) => (props.small ? 60 : 70)}px;
  height: ${(props) => (props.small ? 20 : 25)}px;
  border-radius: 4px;
  text-align: center;
  & span {
    color: inherit;
    line-height: ${(props) => (props.small ? 20 : 25)}px;
  }
`;

const Increased = styled(Tag)`
  background-color: #e2fbda;
  color: #3fe015;
`;

const Decreased = styled(Tag)`
  background-color: #ffdadf;
  color: #eb092b;
`;

export default function HomePage() {
  const [LoC, setLoC] = useState({ additions: 0, deletions: 0 });
  const [todos, setTodos] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const history = useHistory();
  const headerItems = useMemo(
    () => [
      {
        icon: <ChartPie width={40} height={40} />,
        menuItems: [
          {
            title: "Make payment",
          },
          {
            title: "View balance details",
          },
          {
            title: "View account details",
          },
        ],
        value: "$143,624",
        description: "Your bank balance",
      },
      {
        icon: <Briefcase width={40} height={40} />,
        menuItems: [
          {
            title: "View details",
            onClick: () => history.push({ pathname: "/plugins/monitor/todo" }),
          },
        ],
        value: todos.length.toString(),
        description: "Todos on upcoming week",
      },
      {
        icon: (
          <Box>
            <Earth width={38} height={38} />
          </Box>
        ),
        menuItems: [
          {
            title: "View details",
            onClick: () =>
              history.push({ pathname: "/plugins/monitor/visitors" }),
          },
        ],
        value: visitors.length.toString(),
        description: "Visitors today",
      },
      {
        icon: (
          <Box style={{ paddingBottom: 2 }}>
            <File width={36} height={36} />
          </Box>
        ),
        menuItems: [
          {
            title: "Repo",
            onClick: () =>
              window.open("https://github.com/kwang1012/v1", "_blank"),
          },
          {
            title: "View details",
            onClick: () => history.push({ pathname: "/plugins/monitor/repos" }),
          },
        ],
        value: (
          <Flex>
            <Increased small>
              <Typography variant="pi">+ {LoC.additions}</Typography>
            </Increased>
            <Decreased marginLeft={1} small>
              <Typography variant="pi">+ {LoC.deletions}</Typography>
            </Decreased>
          </Flex>
        ),
        description: "LoC updated this week",
      },
    ],
    [LoC, todos.length, visitors.length]
  );
  useEffect(() => {
    let isMounted = true;
    request("/monitor/github/loc").then((data) => isMounted && setLoC(data));
    request("/monitor/todos").then(
      (data) => isMounted & setTodos(normalize(data))
    );
    request(
      `/api/monitor/visitors?filters[createdAt][$gte]=${moment()
        .startOf("day")
        .toISOString()}`
    ).then((data) => isMounted && setVisitors(normalize(data)));
    return () => {
      isMounted = false;
    };
  }, []);

  const { isLoading: isLoadingForModels } = useModels();

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const recentEmails = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <Layout padding={6}>
      <Grid gap={6}>
        <Main>
          <Nav />
          <Box paddingTop={6}>
            <Grid gap={2}>
              {headerItems.map((headerItem, i) => (
                <CustomGridItem key={i} col={3} padding={3}>
                  <Flex justifyContent="space-between">
                    {headerItem.icon}
                    <SimpleMenu
                      as={IconButton}
                      icon={<MoreVert />}
                      label="More"
                    >
                      {headerItem.menuItems.map((menuItem, mid) => (
                        <MenuItem key={mid} onClick={menuItem.onClick}>
                          {menuItem.title}
                        </MenuItem>
                      ))}
                    </SimpleMenu>
                  </Flex>
                  <Box paddingTop={2} paddingBottom={2}>
                    {typeof headerItem.value === "string" ? (
                      <Typography variant="beta">{headerItem.value}</Typography>
                    ) : (
                      headerItem.value
                    )}
                  </Box>
                  <Typography>{headerItem.description}</Typography>
                </CustomGridItem>
              ))}
            </Grid>
          </Box>
          <Box paddingTop={6}>
            <Grid gap={4}>
              <CustomGridItem col={3} padding={3}>
                <Typography variant="beta">New clients</Typography>
                <Flex padding={2} justifyContent="space-between">
                  <Typography variant="alpha">54</Typography>
                  <Increased>
                    <Typography variant="pi" textColor="inherit">
                      + 18.7%
                    </Typography>
                  </Increased>
                </Flex>
              </CustomGridItem>
              <CustomGridItem col={9} row={2} padding={3}>
                <Flex justifyContent="space-between">
                  <Typography variant="beta">Revenue</Typography>
                  <Typography textColor="neutral500">
                    Last 7 days VS prior week
                  </Typography>
                </Flex>
                <RevenueChart />
              </CustomGridItem>
              <CustomGridItem col={3} padding={3}>
                <Typography variant="beta">Invoices overdue</Typography>
                <Flex padding={2} justifyContent="space-between">
                  <Typography variant="alpha">6</Typography>
                  <Decreased>
                    <Typography variant="pi" textColor="inherit">
                      - 2.7%
                    </Typography>
                  </Decreased>
                </Flex>
              </CustomGridItem>
            </Grid>
          </Box>
          <Card marginTop={6} padding={4}>
            <Typography variant="beta">Recent emails</Typography>
            <Box paddingTop={4}>
              <Table colCount={3} rowCount={recentEmails.length}>
                <Tbody>
                  {recentEmails.map((email, i) => (
                    <Tr key={i}>
                      <Td>
                        <Avatar
                          src="https://avatars.githubusercontent.com/u/3874873?v=4"
                          alt="marvin frachet"
                          preview
                        />
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">Kai Wang</Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">
                          bruce1198@gmail.com
                        </Typography>
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">1:24 PM</Typography>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Card>
        </Main>
        <Sidebar todos={todos} />
      </Grid>
    </Layout>
  );
}
