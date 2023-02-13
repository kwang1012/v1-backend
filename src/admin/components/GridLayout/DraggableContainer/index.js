import React, { useState, useRef, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import _ from "lodash";

export function DraggableContainer(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(1200);
  const localLayout = useRef(props.layout);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = () => setWidth(ref.current.offsetWidth);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <GridLayout {...props} layout={localLayout.current} width={width} />
    </div>
  );
}
