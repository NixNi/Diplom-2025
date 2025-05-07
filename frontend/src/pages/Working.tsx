import { useEffect } from "react";
import ModelViewer from "../components/ModelViewer";
import SStatusIndicator from "../components/shared/SStatusIndicator";
import { useActions } from "../hooks/actions";
import { useSocket } from "../hooks/socket";

export default function Working() {
  const actions = useActions();
  useEffect(() => {
    actions.setMode("online");
  }, []);
  useSocket();

  return (
    <div>
      <ModelViewer modelControlsEnable>
        <SStatusIndicator className="absolute right-2 top-1" />
      </ModelViewer>
    </div>
  );
}
