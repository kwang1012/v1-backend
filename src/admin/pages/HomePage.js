import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LoadingIndicatorPage, request } from "@strapi/helper-plugin";
import { Box } from "@strapi/design-system/Box";
import { Card } from "@strapi/design-system/Card";
import { Grid } from "@strapi/design-system/Grid";
import MenuBurger from "@strapi/icons/MenuBurger";
import { useModels } from "../../hooks";
import Sidebar from "components/Sidebar";
import Nav from "components/Nav";
import { normalize } from "utils";
import moment from "moment";
import { DraggableContainer, DraggableItem } from "components/GridLayout";
import { InfoProvider } from "components/InfoContext";
import Section from "components/Section";

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

const Handle = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  cursor: move;
  transform: translateX(-50%) scaleX(2);
  font-size: 30px;
  & path {
    fill: rgba(0, 0, 0, 0.4);
  }
`;

export default function HomePage() {
  const [LoC, setLoC] = useState({ additions: 0, deletions: 0 });
  const [todos, setTodos] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [layout, setLayout] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // layout query
    setFetching(true);

    const fetchData = Promise.all([
      request("/api/layout").then((data) => isMounted && setLayout(data)),
      request("/monitor/github/loc?type=week").then(
        (data) => isMounted && setLoC(data)
      ),
      request("/monitor/todos").then(
        (data) => isMounted & setTodos(normalize(data))
      ),
      request(
        `/api/monitor/visitors?filters[createdAt][$gte]=${moment()
          .startOf("day")
          .toISOString()}`
      ).then((data) => isMounted && setVisitors(normalize(data))),
    ]);
    fetchData.finally(() => setFetching(false));
    return () => {
      isMounted = false;
    };
  }, []);

  const { isLoading: isLoadingForModels } = useModels();

  const isLoading = isLoadingForModels | fetching;

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    request("/api/layout", {
      method: "PUT",
      body: {
        layout: newLayout,
      },
    });
  };

  return (
    <Layout padding={6}>
      <Grid gap={6}>
        <Main>
          <Nav />
          <InfoProvider
            value={{
              todo: todos.length,
              visitor: visitors.length,
              loc: LoC,
            }}
          >
            <DraggableContainer
              style={{
                background: "#cc336310",
                borderRadius: 4,
                marginTop: 24,
              }}
              handle=".handle"
              layout={layout}
              cols={12}
              rowHeight={35}
              onLayoutChange={onLayoutChange}
            >
              {layout.map((lay) => (
                <DraggableItem key={lay.i} component={Card}>
                  <Box
                    paddingLeft={3}
                    paddingRight={3}
                    paddingTop={2}
                    paddingBottom={2}
                    position="relative"
                    height="100%"
                  >
                    <Handle className=".handle">
                      <MenuBurger />
                    </Handle>
                    <Section type={lay.i} />
                  </Box>
                </DraggableItem>
              ))}
            </DraggableContainer>
          </InfoProvider>
          {/* <Box paddingTop={6}>
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
          </Card> */}
        </Main>
        <Sidebar todos={todos} />
      </Grid>
    </Layout>
  );
}
