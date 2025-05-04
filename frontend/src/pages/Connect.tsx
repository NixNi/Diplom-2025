import { useState } from "react";

import "./css/Connect.css";

export default function Connect() {
  const [ip, setIp] = useState<string | null>(null);
  const [port, setPort] = useState<number | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  return (
    <div className="connect">
      <div className="add-connection">Подключится к аппарату</div>
      <div>
        ip
        <input type="text" />
        port
        <input type="text" />
        user
        <input type="text" />
        password
        <input type="text" />
      </div>
      <div className="list-container"></div>
    </div>
  );
}
