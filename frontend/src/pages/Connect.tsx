import { useState } from "react";
import { useActions } from "../hooks/actions";
import {
  useAddConnectMutation,
  usePingMutation,
} from "../store/connect/connect.api";
import "./css/Connect.css";
import SPopUp from "../components/shared/SPopUp";
import { useNavigate } from "react-router";
import ConnecitonList from "../components/ConnecitonList";
import AddIcon from "../icons/svg/add.svg?react";

export default function Connect() {
  const defaultPort = 12537;
  const navigate = useNavigate();
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [popup, setPopup] = useState<boolean>(false);

  const actions = useActions();
  const [ping] = usePingMutation();
  const [addConnect] = useAddConnectMutation();

  const handleSubmit = async (
    setError: (err: string) => void,
    { ipIn, portIn }: { ipIn?: string; portIn?: string }
  ) => {
    try {
      const connectionData = {
        name: (ipIn || ip) + ":" + String(portIn || port || defaultPort),
        ip: ipIn || ip,
        port: String(portIn || port || defaultPort),
      };
      actions.setConnect(connectionData);
      ping(connectionData).then((it) => {
        if (it.error) {
          const error = it.error as any;
          setError(error.data.status + ": " + error.data.message);
        } else {
          addConnect(connectionData);
          navigate("./..");
        }
      });
    } catch (error) {
      console.error("Ошибка при подключении:", error);
    }
  };

  return (
    <div className="connect">
      <div className="add-connection" onClick={() => setPopup(true)}>
        <AddIcon />
        Подключится к аппарату
      </div>

      <ConnecitonList handleSubmit={handleSubmit} />
      <SPopUp setVisibility={setPopup} visibility={popup}>
        <div>
          <div className="flex gap-4">
            <label htmlFor="ipInput">
              <p className="ml-2">IP</p>
              <input
                id="ipInput"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="localhost"
              />
            </label>
            <label htmlFor="portInput">
              <p className="ml-2">PORT</p>
              <input
                id="portInput"
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder={String(defaultPort)}
              />
            </label>

            <div
              onClick={handleSubmit.bind({}, setErrorMessage, {})}
              className="btn"
            >
              Подключится
            </div>
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      </SPopUp>
    </div>
  );
}
