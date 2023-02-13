import React, { useState, useRef, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";

export function DraggableContainer(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(1200);
  const onResize = () => setWidth(ref.current.offsetWidth);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <GridLayout {...props} width={width} />
    </div>
  );
}
