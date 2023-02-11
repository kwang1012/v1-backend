import React, { useState, useEffect } from "react";
import { normalize } from "utils";
import { request } from "@strapi/helper-plugin";
import { Grid } from "@strapi/design-system";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import Board from "./Board";

const StyledAutoGrid = styled(Grid)`
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  grid-template-columns: unset;
  min-width: 850px;
`;

const GridContainer = styled("div")`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;

  &::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    display: none;
    background-color: transparent;
    box-shadow: inset 0 0 10px 10px transparent;
    border: solid 3px transparent;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 10px 10px #cc336370;
    border: solid 3px transparent;
  }
`;

const AutoGrid = (props) => (
  <GridContainer>
    <StyledAutoGrid {...props} height="100%" />
  </GridContainer>
);

export default function Kanban() {
  useEffect(() => {
    request("/monitor/boards?populate[0]=todos&sort[0]=id").then((data) =>
      setBoards(normalize(data))
    );
  }, []);

  const [boards, setBoards] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      setBoards(reorder(source, destination));
      return;
    }
    setBoards(dragCardInBoard(source, destination));
  };

  const reorder = (source, destination) => {
    let tempData = [...boards];
    const boardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    const [removed] = tempData[boardIdx].todos.splice(source.index, 1);
    tempData[boardIdx].todos.splice(destination.index, 0, removed);

    return tempData;
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...boards];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    const updatedTodo = tempData[sourceBoardIdx].todos[source.index];
    tempData[destinationBoardIdx].todos.splice(
      destination.index,
      0,
      updatedTodo
    );
    tempData[sourceBoardIdx].todos.splice(source.index, 1);
    request(`/monitor/todos/${updatedTodo.id}`, {
      method: "PUT",
      body: {
        data: {
          board: destination.droppableId,
        },
      },
    });

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
    <DragDropContext onDragEnd={onDragEnd}>
      <AutoGrid gap={4} paddingTop={6}>
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
  );
}
