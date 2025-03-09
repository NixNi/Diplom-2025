import { ButtonHTMLAttributes } from "react";

export default function SButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  // Extract existing className from props or provide an empty string if not present
  const existingClassName = props.className ? `${props.className} ` : "";
  return (
    <button
      {...props}
      className={`p-2 color-zinc-2 bg-emerald-900 my-4 ${existingClassName}`}
    >
      {props.children}
    </button>
  );
}
