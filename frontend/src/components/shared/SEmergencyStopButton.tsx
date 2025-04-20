import { useActions } from "../../hooks/actions";
import WarningIcon from "../../icons/svg/warning.svg?react";
import "./css/SCircleButton.css";

export default function SEmergencyStopButton() {
  const actions = useActions();

  return (
    <div
      className="circle-button warning warning-hover"
      onClick={() => {
        actions.setEmergency();
      }}
    >
      <WarningIcon className="circle-button_icon" />
    </div>
  );
}
