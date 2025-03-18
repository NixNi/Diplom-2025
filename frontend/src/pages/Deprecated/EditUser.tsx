import SAForm from "../components/shared/SAForm";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import user from "../store/types/user";
import { useAppSelector } from "../hooks/redux";
import { useUpdateMutation } from "../store/user/user.api";

interface EditUserProps {
  onClose?: () => void;
  user?: user;
}

export default function EditUser(props: EditUserProps) {
  const navigator = useNavigate();
  const location = useLocation();

  const User = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editUserFun, editUser] = useUpdateMutation();

  const create = () => {
    const data: Record<string, string | number> = formData;
    data.id = props.user?.id || 0;
    editUserFun(data);
  };

  useEffect(() => {
    if (!User.id) {
      navigator(`/login?redirectTo=${location.pathname}`);
    }
  });
  useEffect(() => {
    if (editUser.data?.status === "ok") {
      const data: Record<string, string | number> = formData;
      setTimeout(() => {
        if (props?.onClose) props.onClose();
        navigator(`/profile/${data.login || ""}`);
        window.location.reload();
      }, 200);
    }
  }, [editUser, formData, navigator, props]);

  return (
    <SAForm
      onSubmit={create}
      setFormData={setFormData}
      button={`Edit user`}
      inputs={[
        {
          text: "Login",
          type: "text",
          name: "login",
          value: props.user?.login || "",
        },
        {
          text: "About self",
          type: "text",
          name: "info",
          value: props.user?.info || "",
        },
      ]}
    >
      {editUser.data?.status === "error" && (
        <div className="bg-amber-2 color-zinc-8 p-1 border-rounded">
          {editUser.data?.text}
        </div>
      )}
    </SAForm>
  );
}
