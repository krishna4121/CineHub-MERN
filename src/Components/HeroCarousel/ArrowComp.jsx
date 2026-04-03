import React from "react";

export function NextArrow(props) {
  return (
    <>
      <div
        className={props.className}
        style={{ right: "10px" }}
        onClick={props.onClick}
      ></div>
    </>
  );
}
export function PrevArrow(props) {
  return (
    <>
      <div
        className={props.className}
        style={{ left: "10px", zIndex: "10" }}
        onClick={props.onClick}
      ></div>
    </>
  );
}
