import { HTMLAttributes } from "react";
import "./css/SSvgButton.css";

interface SSvgButtonProps extends HTMLAttributes<HTMLDivElement> {}

export default function SSvgButton({
  children,
  onClick,
  ...props
}: SSvgButtonProps) {
  return (
    <div
      {...props}
      className={"svg-button " + props.className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
