import React, { memo, useContext, useMemo } from "react";
import styled from "styled-components";
import { Box } from "@strapi/design-system/Box";
import { useHistory } from "react-router-dom";
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { SimpleMenu, MenuItem } from "@strapi/design-system/SimpleMenu";
import { IconButton } from "@strapi/design-system/IconButton";
import { Table, Tbody, Tr, Td } from "@strapi/design-system/Table";
import { Avatar } from "@strapi/design-system/Avatar";
import More from "@strapi/icons/More";
import ChartPie from "@strapi/icons/ChartPie";
import Briefcase from "@strapi/icons/Briefcase";
import Earth from "@strapi/icons/Earth";
import File from "@strapi/icons/File";
import InfoContext from "./InfoContext";
import RevenueChart from "./RevenueChart";

const MoreVert = styled(More)`
  transform: rotate(90deg);
`;

const isHeader = (type) => ["balance", "todo", "visitor", "loc"].includes(type);
const isSide = (type) => ["client", "invoice"].includes(type);
const isRevenue = (type) => type === "revenue";
const isEmail = (type) => type === "email";

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

const HeaderItem = memo(({ item }) => {
  return (
    <>
      <Flex justifyContent="space-between">
        {item.icon}
        <SimpleMenu as={IconButton} icon={<MoreVert />} label="More">
          {item.menuItems.map((menuItem, mid) => (
            <MenuItem key={mid} onClick={menuItem.onClick}>
              {menuItem.title}
            </MenuItem>
          ))}
        </SimpleMenu>
      </Flex>
      <Box paddingTop={2} paddingBottom={2}>
        {typeof item.value === "string" ? (
          <Typography variant="beta">{item.value}</Typography>
        ) : (
          item.value
        )}
      </Box>
      <Typography>{item.description}</Typography>
    </>
  );
});

const SideItem = memo(({ item }) => {
  return (
    <Flex
      padding={1}
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      height="100%"
    >
      <Typography variant="beta">{item.title}</Typography>
      <Flex padding={2} justifyContent="space-between">
        <Typography variant="alpha">{item.value}</Typography>
        {item.type === "increase" ? (
          <Increased>
            <Typography variant="pi" textColor="inherit">
              + {item.percentage}%
            </Typography>
          </Increased>
        ) : (
          <Decreased>
            <Typography variant="pi" textColor="inherit">
              - {item.percentage}%
            </Typography>
          </Decreased>
        )}
      </Flex>
    </Flex>
  );
});

const recentEmails = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

const ScrollArea = styled(Box)`
  flex: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background-color: #eaebec;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 10px 10px #cacccb;
  }
`;

const EmailItem = () => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <Typography variant="beta">Recent emails</Typography>
      <ScrollArea paddingTop={4}>
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
      </ScrollArea>
    </Flex>
  );
};

const RevenueItem = () => {
  return (
    <>
      <Flex justifyContent="space-between">
        <Typography variant="beta">Revenue</Typography>
        <Typography textColor="neutral500">
          Last 7 days VS prior week
        </Typography>
      </Flex>
      <RevenueChart />
    </>
  );
};

export default function Section({ type }) {
  const value = useContext(InfoContext);
  const history = useHistory();

  const sideMap = useMemo(() => ({
    client: {
      title: "New clients",
      value: 54,
      type: "increase",
      percentage: "18.7",
    },
    invoice: {
      title: "Invoices overdue",
      value: 6,
      type: "decrease",
      percentage: "2.7",
    },
  }));

  const headerMap = useMemo(
    () => ({
      balance: {
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
      todo: {
        icon: <Briefcase width={40} height={40} />,
        menuItems: [
          {
            title: "View details",
            onClick: () => history.push({ pathname: "/plugins/monitor/todo" }),
          },
        ],
        value: value.todo.toString(),
        description: "Todos on upcoming week",
      },
      visitor: {
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
        value: value.visitor.toString(),
        description: "Visitors today",
      },
      loc: {
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
              <Typography variant="pi">+ {value.loc.additions}</Typography>
            </Increased>
            <Decreased marginLeft={1} small>
              <Typography variant="pi">- {value.loc.deletions}</Typography>
            </Decreased>
          </Flex>
        ),
        description: "LoC updated this week",
      },
    }),
    [value]
  );
  if (isEmail(type)) return <EmailItem />;
  if (isRevenue(type)) return <RevenueItem />;
  if (isSide(type)) return <SideItem item={sideMap[type]} />;
  if (isHeader(type)) return <HeaderItem item={headerMap[type]} />;
  return type;
}
