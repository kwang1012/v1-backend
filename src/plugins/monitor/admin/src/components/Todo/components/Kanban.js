import React, { useState, useEffect } from "react";
import { normalize } from "utils";
import { request } from "@strapi/helper-plugin";
import { Grid } from "@strapi/design-system";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Board from "./Board";
import { isEmpty } from "lodash";

const StyledAutoGrid = styled(Grid)`
  grid-auto-columns: minmax(200px, 1fr);
  grid-auto-flow: column;
  grid-template-columns: unset;
  min-width: 850px;
  & > * {
    margin-right: 16px;
  }
`;

const GridContainer = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  margin-right: -16px;

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

const AutoGrid = ({ provided, ...props }) => (
  <GridContainer ref={provided.innerRef} {...provided.droppableProps}>
    <StyledAutoGrid {...props} height="100%" />
  </GridContainer>
);

const Placeholder = styled.div`
  position: absolute;
  background-color: #fcfcfc;
  border-radius: 5px;
  border: dashed 1px #f2f2f2;
`;

export default function Kanban() {
  const queryAttr = "data-rbd-draggable-id";
  const [placeholderProps, setPlaceholderProps] = useState({});

  useEffect(() => {
    request("/monitor/boards").then((data) => setBoards(normalize(data)));
  }, []);

  const [boards, setBoards] = useState([]);

  const reorderBoard = (source, destination) => {
    let tempData = [...boards];
    const [removed] = tempData.splice(source.index, 1);
    tempData.splice(destination.index, 0, removed);

    return tempData;
  };

  const reorder = (source, destination) => {
    let tempData = [...boards];
    const boardIdx = tempData.findIndex(
      (item) => `board-droppable-${item.id}` === source.droppableId
    );
    const [removed] = tempData[boardIdx].todos.splice(source.index, 1);
    tempData[boardIdx].todos.splice(destination.index, 0, removed);

    return tempData;
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...boards];
    const destinationBoardIdx = tempData.findIndex(
      (item) => `board-droppable-${item.id}` === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => `board-droppable-${item.id}` === source.droppableId
    );
    const updatedTodo = tempData[sourceBoardIdx].todos[source.index];
    tempData[destinationBoardIdx].todos.splice(
      destination.index,
      0,
      updatedTodo
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
    const trimBoards = boards.map((board, bid) => ({
      id: board.id,
      order: bid,
      ts: board.todos.map((todo, tid) => ({
        id: todo.id,
        order: tid,
        bid: board.id,
      })),
    }));
    request("/monitor/boards/update", {
      method: "POST",
      body: { data: trimBoards },
    });
  }, [boards]);

  const onDragEnd = (result) => {
    setPlaceholderProps({});
    const { source, destination } = result;
    if (!destination) return;

    if (result.type === "COLUMN") {
      setBoards(reorderBoard(source, destination));
      return;
    }

    if (source.droppableId === destination.droppableId) {
      setBoards(reorder(source, destination));
      return;
    }
    setBoards(dragCardInBoard(source, destination));
  };

  const onDragUpdate = (event) => {
    const { type } = event;
    if (!event.destination) {
      return;
    }

    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const destinationIndex = event.destination.index;
    const sourceIndex = event.source.index;

    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    updatePlaceholderProps(draggedDOM, updatedArray, type, destinationIndex);
  };

  const onDragStart = (event) => {
    const { type } = event;
    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }
    const sourceIndex = event.source.index;

    updatePlaceholderProps(
      draggedDOM,
      [...draggedDOM.parentNode.children],
      type,
      sourceIndex
    );
  };

  const updatePlaceholderProps = (draggedDOM, arr, type, targetIdx) => {
    const dragTarget =
      draggedDOM.querySelector(":scope > .drag-target") || draggedDOM;
    const { clientHeight, clientWidth } = dragTarget;
    const domStyle =
      dragTarget.currentStyle || window.getComputedStyle(dragTarget);
    const width = clientWidth - parseFloat(domStyle.paddingRight);
    const height = clientHeight - parseFloat(domStyle.paddingBottom);
    const top =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      (type === "COLUMN"
        ? 0
        : arr.slice(0, targetIdx).reduce((total, curr) => {
            const style = curr.currentStyle || window.getComputedStyle(curr);
            const marginBottom = parseFloat(style.marginBottom);
            return total + curr.clientHeight + marginBottom;
          }, 0));

    const left =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft) +
      (type !== "COLUMN"
        ? 0
        : arr.slice(0, targetIdx).reduce((total, curr) => {
            const style = curr.currentStyle || window.getComputedStyle(curr);
            const marginRight = parseFloat(style.marginRight);
            return total + curr.clientWidth + marginRight;
          }, 0));
    setPlaceholderProps({
      top,
      left,
      width,
      height,
    });
  };

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    return draggedDOM;
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      ignoreContainerClipping={false}
    >
      <Droppable droppableId="kanban" type="COLUMN" direction="horizontal">
        {(provided, snapshot) => (
          <AutoGrid gap={0} paddingTop={6} provided={provided}>
            {boards.map((board, bid) => (
              <Board
                key={board.id}
                id={board.id}
                index={bid}
                title={board.title}
                items={board.todos}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
                placeholderProps={placeholderProps}
              />
            ))}
            {provided.placeholder}
            {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
              <Placeholder style={placeholderProps} />
            )}
          </AutoGrid>
        )}
      </Droppable>
    </DragDropContext>
  );
}
