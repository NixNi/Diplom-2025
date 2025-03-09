import { InputHTMLAttributes } from "react";

export default function SInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input className="p-1 border border-white" {...props}>
      {props.children}
    </input>
  );
}
