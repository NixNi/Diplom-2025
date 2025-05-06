import { useState } from "react";
import { useActions } from "../hooks/actions";
import { useAddConnectMutation } from "../store/connect/connect.api";
import "./css/Connect.css";

export default function Connect() {
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setConnect } = useActions();
  const [addConnect] = useAddConnectMutation();

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "ip":
        setIp(value);
        setConnect({ ip: value, port: Number(port), user, password });
        break;
      case "port":
        setPort(value);
        setConnect({ ip, port: Number(value), user, password });
        break;
      case "user":
        setUser(value);
        setConnect({ ip, port: Number(port), user: value, password });
        break;
      case "password":
        setPassword(value);
        setConnect({ ip, port: Number(port), user, password: value });
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const connectionData = {
        ip,
        port: Number(port),
        ...(user && { user }),
        ...(password && { password }),
      };
      await addConnect(connectionData).unwrap();
    } catch (error) {
      console.error("Ошибка при подключении:", error);
    }
  };

  return (
    <div className="connect">
      <div className="add-connection" onClick={handleSubmit}>
        Подключится к аппарату
      </div>
      <div>
        ip
        <input
          type="text"
          value={ip}
          onChange={(e) => handleInputChange("ip", e.target.value)}
        />
        port
        <input
          type="text"
          value={port}
          onChange={(e) => handleInputChange("port", e.target.value)}
        />
        user
        <input
          type="text"
          value={user}
          onChange={(e) => handleInputChange("user", e.target.value)}
        />
        password
        <input
          type="password"
          value={password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </div>
      <div className="list-container"></div>
    </div>
  );
}
