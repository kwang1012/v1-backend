import React, { useState } from "react";
import {
  Typography,
  Flex,
  Box,
  Button,
  TextButton,
} from "@strapi/design-system";
import { Searchbar, SearchForm } from "@strapi/design-system";
import {
  More,
  Plus,
  CheckCircle,
  Filter,
  List,
  Grid as GridIcon,
} from "@strapi/icons";
import styled from "styled-components";
import CustomIconButton from "./components/IconButton";
import Kanban from "./components/Kanban";

const Outline = styled(Flex)`
  background: #f9f9f9;
  border-radius: 12px;
  border: solid 1px #eaeaef;
  padding: 4px;
  align-items: center;
`;

const OutlineButton = styled(Button)`
  height: 2.5em;
  padding: 0 8px;
  border-radius: 8px;
`;

const FilterButton = styled(Button)`
  padding: 0 8px;
  & span {
    display: flex;
    align-items: center;
    svg {
      margin-right: 4px;
    }
  }
`;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const outlines = ["Overview", "List", "Board", "Timeline"];

export default function Todo() {
  const [value, setValue] = useState("");
  return (
    <Container direction="column">
      <Typography variant="beta">Customer Stories</Typography>
      <Outline marginTop={8}>
        {outlines.map((outline) => (
          <Box key={outline} paddingLeft={4} paddingRight={4}>
            <TextButton>
              <Typography textColor="neutral500">{outline}</Typography>
            </TextButton>
          </Box>
        ))}
        <Box marginLeft="auto">
          <OutlineButton>
            <Plus /> <Typography>Add chart</Typography>
          </OutlineButton>
        </Box>
      </Outline>
      <Box marginTop={4}>
        <Flex alignItems="center">
          <Box flex="1" marginRight={2}>
            <SearchForm>
              <Searchbar
                name="searchbar"
                onClear={() => setValue("")}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                clearLabel="clear"
                placeholder="e.g: Created yesterday"
              >
                Searching for a plugin
              </Searchbar>
            </SearchForm>
          </Box>
          <FilterButton variant="ghost">
            <CheckCircle />
            All Tasks
          </FilterButton>
          <FilterButton variant="ghost">
            <Filter />
            Filter
          </FilterButton>
          <FilterButton variant="ghost">
            <List />
            Sort
          </FilterButton>
          <FilterButton variant="ghost">
            <GridIcon />
            Customize
          </FilterButton>
          <CustomIconButton label="More">
            <More />
          </CustomIconButton>
        </Flex>
      </Box>
      <Kanban />
    </Container>
  );
}
