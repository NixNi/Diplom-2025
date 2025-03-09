import { useAppSelector } from "../hooks/redux";
import SAForm from "../components/shared/SAForm";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  useAddGroupMutation,
  useLazyGetGroupByNameQuery,
  useUpdateGroupMutation,
} from "../store/group/group.api";
import { useAddGroupUserMutation } from "../store/ugr/ugr.api";
import group from "../store/types/group";

interface CreateGroupProps {
  onClose?: () => void;
  edit?: boolean;
  group?: group;
}

export default function CreateGroup(props: CreateGroupProps) {
  const navigator = useNavigate();
  const location = useLocation();

  const User = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [createGroupFun, group] = useAddGroupMutation();
  const [editGroupFun] = useUpdateGroupMutation();
  const [addUGRFun] = useAddGroupUserMutation();
  const [groupDataFun, groupData] = useLazyGetGroupByNameQuery();

  const create = () => {
    const data: Record<string, string | number> = formData;
    data.owner = props.edit ? props.group?.owner || 0 : User.id;
    data.id = props?.group?.id || 0;
    if (data.id == 0 || !data.id) delete data.id;
    props.edit ? editGroupFun(data) : createGroupFun(data);
    setTimeout(() => {
      if (props?.onClose) props.onClose();
      navigator(`/group/${data.name || ""}`);
      window.location.reload()
    }, 200);
  };

  useEffect(() => {
    if (!User.id) {
      navigator(`/login?redirectTo=${location.pathname}`);
    }
  });
  useEffect(() => {
    if (group.data?.status === "ok") {
      groupDataFun(formData.name);
    }
  }, [group, navigator, formData, addUGRFun, groupDataFun]);
  useEffect(() => {
    if (groupData.data?.created_at) {
      if (!props.edit) addUGRFun(groupData.data?.id || 0);
      navigator(`/group/${groupData.data?.name || ""}`);
    }
  }, [group, navigator, addUGRFun, groupData, props.edit]);

  return (
    <SAForm
      onSubmit={create}
      setFormData={setFormData}
      button={`${props.edit ? "Edit" : "Create"} Group`}
      inputs={[
        {
          text: "Name",
          type: "text",
          name: "name",
          value: props.group?.name || "",
        },
        {
          text: "Description",
          type: "text",
          name: "description",
          value: props.group?.description || "",
        },
      ]}
    >
      {group.data?.status === "error" && (
        <div className="bg-amber-2 color-zinc-8 p-1 border-rounded">
          {group.data?.text}
        </div>
      )}
    </SAForm>
  );
}
