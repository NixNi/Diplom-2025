import { useEffect } from "react";
import ModelViewer from "../components/ModelViewer";
import SStatusIndicator from "../components/shared/SStatusIndicator";
import { useActions } from "../hooks/actions";
import { useSocket } from "../hooks/socket";
import { useAppSelector } from "../hooks/redux";
import { useNavigate } from "react-router";

export default function Working() {
  const actions = useActions();
  const connection = useAppSelector((state) => state.connect);
  const navigate = useNavigate();

  useEffect(() => {
    if (!connection.ip) navigate("/connect");
    else {
      actions.setMode("online");
    }
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
