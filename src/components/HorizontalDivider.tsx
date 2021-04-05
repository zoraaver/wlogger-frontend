import * as React from "react";

interface HorizontalDividerProps {
  text: string;
  thickness: number;
  marginTop: number;
}

export function HorizontalDivider({
  text,
  thickness,
  marginTop,
}: HorizontalDividerProps) {
  return (
    <div
      style={{
        borderTop: `${thickness}px solid lightgrey`,
        marginTop,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "relative",
          top: "-1em",
        }}
        className="bg-light px-1"
      >
        {text}
      </span>
    </div>
  );
}
