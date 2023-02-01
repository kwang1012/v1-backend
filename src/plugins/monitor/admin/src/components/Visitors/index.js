import React, { useEffect, useState, useMemo } from "react";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system";
import {
  Breadcrumbs,
  Crumb,
  Stack,
  Flex,
  Box,
  Card,
  Typography,
} from "@strapi/design-system";
import styled from "styled-components";
import { normalize } from "utils";
import { request } from "@strapi/helper-plugin";
import VisitorChart from "./components/VisitorChart";
import moment from "moment";

const Tag = styled(Box)`
  padding: 0 12px;
  height: ${(props) => (props.small ? 20 : 25)}px;
  border-radius: 4px;
  text-align: center;
  & span {
    font-size: ${(props) => (props.small ? 12 : 14)}px;
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

const Divider = styled("div")`
  align-self: stretch;
  width: 1px;
  background: #ddd;
  flex-shrink: 0;
`;

const Block = ({ title, value, content }) => {
  return (
    <>
      <Flex
        direction="column"
        flex="1"
        flexShrink="0"
        paddingTop={2}
        paddingBottom={2}
      >
        <Typography variant="title">{title}</Typography>
        <Box padding={2}>
          <Typography variant="beta">{value}</Typography>
        </Box>
        {content}
      </Flex>
    </>
  );
};

const Link = styled("a")`
  border-bottom: 1px dotted #ccc;
  text-decoration: none;
  color: #337ab7;
  cursor: pointer;
`;

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  useEffect(() => {
    request("/api/monitor/visitors").then((data) =>
      setVisitors(normalize(data))
    );
  }, []);

  const lastVisitor = useMemo(() => visitors.at(-1), [visitors]);

  return (
    <>
      <Stack horizontal spacing={3}>
        <Breadcrumbs label="Category, website">
          <Crumb>Visitors</Crumb>
          <Crumb>kwang.cc</Crumb>
        </Breadcrumbs>
      </Stack>
      <Flex marginTop={6} alignItems="stretch" style={{ minWidth: 900 }}>
        <Block
          title="Today Pageviews"
          value={0}
          content={
            <Decreased small>
              <Typography>-1(-100%)</Typography>
            </Decreased>
          }
        />
        <Block title="Yesterday" value={5} />
        <Divider />
        <Block
          title="Last 7 days"
          value={18}
          content={
            <Typography textColor="neutral300" variant="pi">
              Jan 25th - Jan 31st
            </Typography>
          }
        />
        <Block
          title="Previous Period"
          value={6}
          content={
            <Typography textColor="neutral300" variant="pi">
              Jan 18th - Jan 24th
            </Typography>
          }
        />
        <Divider />
        <Block
          title="Last 30 days"
          value={279}
          content={
            <Typography textColor="neutral300" variant="pi">
              Jan 2nd - Jan 31st
            </Typography>
          }
        />
        <Block
          title="Previous Period"
          value={33}
          content={
            <Typography textColor="neutral300" variant="pi">
              Dec 3rd - Jan 1st
            </Typography>
          }
        />
        <Divider />
        <Block
          title="Total Pageviews"
          value={312}
          content={
            <Typography textColor="neutral300" variant="pi">
              Since Dec 31st 2022
            </Typography>
          }
        />
      </Flex>
      <Box paddingTop={10}>
        <Table colCount={4} rowCount={visitors.length}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">Recent visitors</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Connection type</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">Timezone</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">IP</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {visitors.map((visitor, i) => (
              <Tr key={i}>
                <Td>
                  <Flex alignItems="center">
                    <img
                      width="32"
                      src={visitor.flag?.png}
                      label="country"
                      style={{ marginRight: 12 }}
                    />
                    <Typography>
                      Visitor from{" "}
                      <Link>
                        {visitor.city}, {visitor.country}
                      </Link>{" "}
                      with 1 pageview
                    </Typography>
                  </Flex>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {visitor.connection?.connection_type}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {visitor.timezone?.name}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link>{visitor.ip_address}</Link>
                  </Typography>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Card marginTop={8}>
        <Flex padding={3} style={{ borderBottom: "1px #eaeaef solid" }}>
          <Typography variant="beta" fontWeight="400">
            Visitors Overview fo kwnag.cc
          </Typography>
        </Flex>
        <Box padding="24px 32px">
          <VisitorChart />
        </Box>
        <Flex
          padding={3}
          justifyContent="space-between"
          alignItems="center"
          style={{ borderTop: "1px #eaeaef solid", backgroundColor: "#f7f9fa" }}
        >
          <Typography variant="pi" textColor="neutral500">
            Last update: {moment(lastVisitor?.createdAt).format("MMMM D, YYYY")}
          </Typography>
          <Flex alignItems="center">
            <Typography variant="pi" textColor="neutral500">
              Last active user:
            </Typography>
            <img
              width="16"
              src={lastVisitor?.flag?.png}
              label="country"
              style={{ margin: "0 4px" }}
            />
            <Typography variant="pi" textColor="neutral500">
              {lastVisitor?.city}, {lastVisitor?.country}
            </Typography>
            <Link style={{ marginLeft: 4 }}>
              <Typography variant="pi" textColor="neutral500">
                22 hours ago
              </Typography>
            </Link>
          </Flex>
        </Flex>
      </Card>
    </>
  );
}
