import { HTMLAttributes } from "react";
import { useAppSelector } from "../../hooks/redux";
import "./css/SStatusIndicator.css";

const SStatusIndicator = (props: HTMLAttributes<HTMLDivElement>) => {
  const model = useAppSelector((state) => state.model);
  const status =
    (model.isEnabled &&
      model.isControlsEnabled &&
      !model.isEmergencyStoped &&
      "Online") ||
    (model.isEnabled &&
      !model.isControlsEnabled &&
      !model.isEmergencyStoped &&
      "Working") ||
    (model.isEnabled && model.isEmergencyStoped && "Emergency Stopped") ||
    (!model.isEnabled && "Offline");
  return (
    <div {...props} className={"status-container " + props.className}>
      <div data-status={status} className="status-circle" />
      <div>{status}</div>
    </div>
  );
};

export default SStatusIndicator;
