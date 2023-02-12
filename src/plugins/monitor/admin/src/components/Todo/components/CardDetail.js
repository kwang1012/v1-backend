import React, { useState, useEffect } from "react";
import {
  ModalLayout,
  ModalBody,
  Box,
  Typography,
  TextInput,
  Flex,
  Button,
} from "@strapi/design-system";
import { Cross } from "@strapi/icons";
import { request } from "@strapi/helper-plugin";
import { normalize } from "utils";
import styled from "styled-components";

const TitleInput = styled(TextInput)`
  div:has(> &) {
    border: none;
  }
  color: #172b4d;
  font-size: 20px;
  &:focus {
    padding: 6.5px 14px;
  }
`;

const CloseBtn = styled(Button)`
  border-radius: 50%;
  padding: 0;
  height: 2em;
  width: 2em;
  justify-content: center;
`;

const Placeholder = styled(TextInput)`
  display: none;
  div:has(> &) {
    border: none;
  }
`;

export default function CardDetail({ todo, onClose = () => {} }) {
  useEffect(() => {
    setLoading(true);
    request(`/monitor/todos/${todo.id}`)
      .then((data) => setInternalTodo(normalize(data)))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);
  const [internalTodo, setInternalTodo] = useState(todo);
  const [loading, setLoading] = useState(false);
  return (
    <ModalLayout
      onClose={onClose}
      labelledBy={todo.title}
      style={{ maxWidth: 600 }}
    >
      <ModalBody>
        <Placeholder aria-label="placeholder" name="placeholder" />
        <Flex justifyContent="space-between">
          <TitleInput
            placeholder="Title"
            aria-label="Title"
            name="title"
            onChange={(e) =>
              setInternalTodo((t) => ({ ...t, title: e.target.value }))
            }
            value={internalTodo.title}
            size="S"
          />
          <CloseBtn variant="ghost" onClick={onClose}>
            <Cross width={18} height={18} />
          </CloseBtn>
        </Flex>
        {!loading && (
          <>
            <Box paddingLeft={4} paddingRight={4}>
              <Typography variant="omega" textColor="neutral500">
                in list{" "}
                <span style={{ textDecoration: "underline" }}>
                  {internalTodo.board?.title || 123}
                </span>
              </Typography>
            </Box>
            <Flex></Flex>
          </>
        )}
      </ModalBody>
    </ModalLayout>
  );
}
