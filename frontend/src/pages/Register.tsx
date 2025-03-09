import { useEffect, useState } from "react";
import { useRegisterMutation } from "../store/user/user.api";
import SAForm from "../components/shared/SAForm";

export default function Register() {
  const [formData, setFormData] = useState<Record<string, string>>({
    login: "",
    password: "",
    password1: "",
    info: "",
    role: "USER",
  });
  const setFormDataCustom = (data: Record<string, string>) => {
    data.role = "USER";
    setFormData(data);
  };
  const [info, setInfo] = useState({ status: "", text: "" });

  useEffect(() => {
    let status = "ok";
    let text = "";
    if (formData.password != formData.password1) {
      status = "error";
      text = "Passwords mismatch";
    }
    if (formData.password.length < 4) {
      status = "error";
      text = "Password must contain more than 4 characters";
    }
    if (formData.login.length < 3) {
      status = "error";
      text = "Login must contain more than 3 characters";
    }
    setInfo({ status, text });
  }, [formData]);

  const [registerFun, data] = useRegisterMutation();

  const register = () => {
    if (info.status !== "error") registerFun(formData);
  };

  return (
    <SAForm
      onSubmit={register}
      setFormData={setFormDataCustom}
      button="Register"
      inputs={[
        { text: "Login", type: "text", name: "login" },
        { text: "About Self", type: "text", name: "info" },
        { text: "Password", type: "password", name: "password" },
        { text: "Password", type: "password", name: "password1" },
      ]}
    >
      {info?.status === "error" && (
        <div className="bg-sky-3 color-zinc-8 p-1 border-rounded">
          {info.text}
        </div>
      )}
      {data.data?.status === "error" && (
        <div className="bg-amber-2 color-zinc-8 p-1 border-rounded">
          {data.data?.text}
        </div>
      )}
      {data.data?.status === "ok" && info?.status !== "error" && (
        <div className="bg-emerald color-zinc-8 p-1 border-rounded">
          {data.data?.text}
        </div>
      )}
    </SAForm>
  );
}
