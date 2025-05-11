import { HTMLAttributes, ReactElement, useEffect, useState } from "react";
import "./css/SPopUp.css";

interface SPopUPprops extends HTMLAttributes<HTMLDivElement> {
  setVisibility: (state: boolean) => void;
  visibility: boolean;
  // children?: ReactElement<unknown>[];
}

const SPopUp = ({
  children,
  setVisibility,
  visibility,
  ...rest
}: SPopUPprops) => {
  const setVisibilityInternal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    vis: boolean
  ) => {
    console.log("abcdse");
    e.preventDefault();
    e.stopPropagation();
    setVisibility(vis);
  };
  if (!visibility) return null;
  return (
    <div
      // hidden={!visibility}
      className="PopUp-Background"
      onMouseDown={(e) => {
        setVisibilityInternal(e, false);
      }}
    >
      <div
        {...rest}
        className={"PopUp " + rest.className || ""}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SPopUp;
