import React, { useState } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Flex, Button, Textarea, TextInput } from "@strapi/design-system";
import { Plus, More, Drag } from "@strapi/icons";
import TodoCard from "./Card";
import CustomIconButton from "./IconButton";
import { Droppable } from "react-beautiful-dnd";
import { SimpleMenu, MenuItem } from "@strapi/design-system/SimpleMenu";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { normalize } from "utils";
import { isEmpty } from "lodash";

const Container = styled.div`
  width: 100%;
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

const AddButton = styled(Button)`
  border: 1px #ccc dashed;
  border-radius: 12px;
  background: #f9f9f9;
  color: #1c1c1c;
  height: ${(props) => (props.large ? "7.85em" : "2.5em")};
  & span {
    display: flex;
    align-items: center;
  }
  & svg {
    margin-right: 5px;
  }
  &::after {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

const TitleInput = styled(TextInput)`
  div:has(> &) {
    border: none;
  }
  color: #32324d;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 6.5px 8px;
  &:focus {
    padding: 4.5px 6px;
  }
`;

const Placeholder = styled.div`
  position: absolute;
  background-color: #fcfcfc;
  border-radius: 5px;
  border: dashed 1px #f2f2f2;
`;

const List = ({ id, items, updateCard, removeCard, placeholderProps }) => {
  return (
    <Container>
      <Droppable droppableId={`board-droppable-${id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 1,
              paddingTop: 1,
              position: "relative",
            }}
          >
            {items.map((item, i) => (
              <TodoCard
                key={i}
                index={i}
                todo={item}
                updateCard={updateCard}
                removeCard={removeCard}
              />
            ))}
            {provided.placeholder}
            {!isEmpty(placeholderProps) && snapshot.isDraggingOver && (
              <Placeholder style={placeholderProps} />
            )}
          </div>
        )}
      </Droppable>
    </Container>
  );
};

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  border-radius: 5px;
  transition: box-shadow 0.2s, background 0.2s;
  background: ${({ isDragging }) => (isDragging ? "#e2fbda" : "none")};
  boxshadow: ${({ isDragging }) =>
    isDragging
      ? "rgba(0, 0, 0, 0.2) 0px 19px 38px, rgba(0, 0, 0, 0.11) 0px 15px 12px"
      : "none"};
  padding: ${({ isDragging }) => (isDragging ? "10px" : 0)};
  height: ${({ isDragging }) => (isDragging ? "unset" : "100%")};
`;

const Board = ({
  id,
  title,
  index,
  items = [],
  addCard,
  removeCard,
  removeBoard,
  updateCard,
  placeholderProps,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState("");
  const [internalTitle, setInternalTitle] = useState(title);

  const createCard = (title) => {
    request("/monitor/todos", {
      method: "POST",
      body: {
        data: {
          title,
          board: id,
        },
      },
    })
      .then((data) => {
        setContent("");
        setIsVisible(false);
        addCard(normalize(data), id);
      })
      .catch(console.log);
  };

  return (
    <>
      <Draggable draggableId={`board-draggable-${id}`} index={index}>
        {(provided, snapshot) => (
          <FlexColumn
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="drag-target"
            isDragging={snapshot.isDragging}
          >
            <Flex alignItems="center" marginBottom={4} flexShrink={0}>
              <div {...provided.dragHandleProps}>
                <Drag />
              </div>
              <TitleInput
                name="title"
                placeholder="Board name"
                aria-label="Board name"
                value={internalTitle}
                onChange={(e) => setInternalTitle(e.target.value)}
              />
              <Flex marginLeft="auto">
                <CustomIconButton
                  textColor="neutral500"
                  icon={<Plus />}
                  label="Create"
                  onClick={() => setIsVisible(true)}
                />
                <SimpleMenu as={CustomIconButton} icon={<More />} label="More">
                  <MenuItem onClick={removeBoard}>Remove</MenuItem>
                </SimpleMenu>
              </Flex>
            </Flex>
            <List
              id={id}
              items={items}
              updateCard={updateCard}
              removeCard={removeCard}
              placeholderProps={placeholderProps}
            />

            <AddButton
              fullWidth
              variant="ghost"
              large={items.length === 0}
              onClick={() => setIsVisible(true)}
            >
              <Plus />
              Add Task
            </AddButton>
          </FlexColumn>
        )}
      </Draggable>
      <Dialog
        onClose={() => setIsVisible(false)}
        title="Create a Todo"
        isOpen={isVisible}
      >
        <DialogBody>
          <Textarea
            placeholder="Enter a title for this card..."
            name="title"
            aria-label="Title"
            required
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </DialogBody>
        <DialogFooter
          startAction={
            <Button onClick={() => setIsVisible(false)} variant="tertiary">
              Cancel
            </Button>
          }
          endAction={
            <Button variant="primary500" onClick={() => createCard(content)}>
              Confirm
            </Button>
          }
        />
      </Dialog>
    </>
  );
};

export default Board;
