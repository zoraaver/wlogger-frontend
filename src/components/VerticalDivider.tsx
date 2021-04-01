import * as React from "react";

interface VerticalDividerProps {
  text: string;
  thickness: number;
}

export function VerticalDivider({ text, thickness }: VerticalDividerProps) {
  return (
    <div
      style={{
        borderLeft: `${thickness}px solid lightgrey`,
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          position: "relative",
          left: "-0.5em",
        }}
        className="bg-light"
      >
        {text}
      </span>
    </div>
  );
}
