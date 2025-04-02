import "./css/SArrowButton.css";

export interface SArrowButton {
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  onClick?: () => {};
  className?: string;
}

export default function SArrowButton(props: SArrowButton) {
  let cls = "";
  cls = props.left ? "arr-btn-left" : cls;
  cls = props.right ? "arr-btn-right" : cls;
  cls = props.up ? "arr-btn-up" : cls;
  cls = props.down ? "arr-btn-down" : cls;
  return (
    <div
      className={`arr-btn ${cls} ${props.className}`}
      onClick={props.onClick}
    ></div>
  );
}
