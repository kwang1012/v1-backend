import React, { useState, useEffect } from "react";
import { normalize } from "utils";
import { request } from "@strapi/helper-plugin";
import {
  Typography,
  Grid,
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
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import Board from "./components/Board";
import CustomIconButton from "./components/IconButton";

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

const AutoGrid = styled(Grid)`
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  grid-template-columns: unset;
  min-width: 800px;
`;

const outlines = ["Overview", "List", "Board", "Timeline"];

export default function Todo() {
  const [value, setValue] = useState("");
  useEffect(() => {
    request("/monitor/boards?populate[0]=todos").then((data) =>
      setBoards(normalize(data))
    );
  }, []);

  const [boards, setBoards] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setBoards(dragCardInBoard(source, destination));
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...boards];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].todos.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].todos[source.index]
    );
    tempData[sourceBoardIdx].todos.splice(source.index, 1);

    return tempData;
  };

  const addCard = (todo, bid) => {
    const index = boards.findIndex((item) => item.id === bid);
    const tempData = [...boards];
    tempData[index].todos.push(todo);
    setBoards(tempData);
  };

  const removeCard = (boardId, cardId) => {
    const index = boards.findIndex((item) => item.id === boardId);
    const tempData = [...boards];
    const cardIndex = boards[index].todos.findIndex(
      (item) => item.id === cardId
    );

    tempData[index].todos.splice(cardIndex, 1);
    setBoards(tempData);
  };

  // const addBoard = (title) => {
  //   const tempData = [...boards];
  //   tempData.push({
  //     id: uuidv4(),
  //     boardName: title,
  //     card: [],
  //   });
  //   setBoards(tempData);
  // };

  const removeBoard = (bid) => {
    const tempData = [...boards];
    const index = boards.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setBoards(tempData);
  };
  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].todos;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].todos[cardIndex] = card;
    setBoards(tempBoards);
  };

  useEffect(() => {
    // TODO update db
    // localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [boards]);
  return (
    <>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <AutoGrid gap={4} marginTop={6}>
          {boards.map((board) => (
            <Board
              key={board.id}
              id={board.id}
              title={board.title}
              items={board.todos}
              addCard={addCard}
              removeCard={removeCard}
              removeBoard={removeBoard}
              updateCard={updateCard}
            />
          ))}
        </AutoGrid>
      </DragDropContext>
    </>
  );
}
