import "./css/SArrowButton.css";
import { HTMLAttributes } from "react";

export interface SArrowButton extends HTMLAttributes<HTMLDivElement> {
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
}

export default function SArrowButton({
  left,
  right,
  up,
  down,
  className,
  ...restProps
}: SArrowButton) {
  let cls = "";
  cls = left ? "arr-btn-left" : cls;
  cls = right ? "arr-btn-right" : cls;
  cls = up ? "arr-btn-up" : cls;
  cls = down ? "arr-btn-down" : cls;

  return (
    <div {...restProps} className={`arr-btn ${cls} ${className || ""}`}></div>
  );
}
