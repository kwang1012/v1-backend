import React, { forwardRef, createElement } from "react";
import styled from "styled-components";

const Basic = styled.div`
  cursor: move;
`;

const Container = styled(Basic)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
`;

export const DraggableItem = forwardRef(({ component, ...props }, ref) => {
  return (
    <>
      {component ? (
        <Basic ref={ref}>{createElement(component, props)}</Basic>
      ) : (
        <Container {...props} />
      )}
    </>
  );
});
