import "./css/SArrowCross.css";
import SArrowButton from "./SArrowButton";

// export interface SArrowCross {

// }

export default function SArrowCross() {
  return (
    <div>
      <div className="cr-row">
        <div className="squire-small" />
        <SArrowButton up />
      </div>
      <div className="cr-row">
        <SArrowButton right />
        <div className="squire" />
        <SArrowButton left />
      </div>
      <div className="cr-row">
        <div className="squire-small" />
        <SArrowButton down />
      </div>
    </div>
  );
}
