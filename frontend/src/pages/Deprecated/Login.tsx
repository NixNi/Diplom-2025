import { useEffect, useState } from "react";
import { useAuthentificateMutation } from "../store/user/user.api";
import { useActions } from "../hooks/actions";
import { useAppSelector } from "../hooks/redux";
import SAForm from "../components/shared/SAForm";
import SButton from "../components/shared/SButton";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function Login() {
  const { setUser, logout } = useActions();
  const navigator = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get("redirectTo");
  const User = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loginFun, data] = useAuthentificateMutation();

  const login = () => {
    loginFun(formData);
  };

  useEffect(() => {
    if (data.data?.user) {
      setUser(data.data.user);
      if (data.data.status == "ok") navigator(redirect || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {User.id === 0 && (
        <div>
          <SAForm
            onSubmit={login}
            setFormData={setFormData}
            button="Login"
            inputs={[
              { text: "Login", type: "text", name: "login" },
              { text: "Password", type: "password", name: "password" },
            ]}
          >
            {data.data?.status === "error" && (
              <div className="bg-amber-2 color-zinc-8 p-1 border-rounded">
                {data.data?.text}
              </div>
            )}
          </SAForm>
          <p className="text-center">
            Don't have an account?{" "}
            <Link
              className="color-amber-4  decoration-none"
              to="/register"
            >
              Register
            </Link>
          </p>
        </div>
      )}
      {User.id !== 0 && (
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-center mt-8">
            You are already logged in as{" "}
            <span className="color-amber-4">{User.login}</span>
          </h2>
          <SButton
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            Log out
          </SButton>
        </div>
      )}
    </>
  );
}
