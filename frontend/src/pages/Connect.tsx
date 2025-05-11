import { useState } from "react";
import { useActions } from "../hooks/actions";
import {
  useAddConnectMutation,
  usePingMutation,
} from "../store/connect/connect.api";
import "./css/Connect.css";
import SPopUp from "../components/shared/SPopUp";
import { useNavigate } from "react-router";

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

  const handleSubmit = async () => {
    try {
      const connectionData = {
        ip,
        port: Number(port) || defaultPort,
      };
      actions.setConnect(connectionData);
      ping(connectionData).then((it) => {
        if (it.error) {
          const error = it.error as any;
          setErrorMessage(error.data.status + ": " + error.data.message);
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
        Подключится к аппарату
      </div>

      <div className="list-container"></div>
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
            <label htmlFor="ipInput">
              <p>PORT</p>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder={String(defaultPort)}
              />
            </label>

            <div onClick={handleSubmit} className="btn">
              Подключится
            </div>
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
      </SPopUp>
    </div>
  );
}
