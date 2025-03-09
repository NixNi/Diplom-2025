import { useAppSelector } from "../hooks/redux";
import SAForm from "../components/shared/SAForm";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAddPostMutation, useUpdatePostMutation } from "../store/post/post.api";
import { useGroupsByUserQuery } from "../store/ugr/ugr.api";
import group from "../store/types/group";
import post from "../store/types/post";
interface CreatePostProps {
  onClose?: () => void;
  edit?: boolean;
  post?: post;
}
export default function CreatePost(props: CreatePostProps) {
  const navigator = useNavigate();
  const location = useLocation();

  const User = useAppSelector((state) => state.user);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [createPostFun, post] = useAddPostMutation();
  const [editPostFun] = useUpdatePostMutation();

  const groupsIDs = useGroupsByUserQuery(User.id || 0);
  const [groups, setGroups] = useState<[string, number][]>();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (groupsIDs.data) {
          const groupPromises = groupsIDs.data.map(async (it) => {
            const response = await fetch(`/api/group/id/${it.group_id}`);
            const data: group = await response.json();
            return data;
          });

          const groupsData = await Promise.all(groupPromises);
          const groupsRendered = groupsData.reduce(
            (acc: [string, number][], rec: group) => {
              acc.push([rec.name, rec.id]);
              return acc;
            },
            []
          );
          setGroups(groupsRendered);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [groupsIDs.data]);

  const create = () => {
    const data: Record<string, string | number | null> = formData;
    data.user_id = props.edit ? (props.post?.user_id || 0) : User.id;
    if(props.edit) data.id = props.post?.id || 0; 
    if (
      data.group_id == "" ||
      data.group_id == 0 ||
      !data.group_id ||
      data.group_id == "undefined" ||
      data.group_id == "null"
    ) props.edit ? data.group_id = null :delete data.group_id;
    props.edit ? editPostFun(data) :createPostFun(data);
    if (props?.onClose) props.onClose()
  };


  useEffect(() => {
    if (!User.id) {
      navigator(`/login?redirectTo=${location.pathname}`);
    }
  });

  return (
    <SAForm
      onSubmit={create}
      setFormData={setFormData}
      button={`${props.edit ? "Edit" : "Create"} Post`}
      inputs={[
        {
          text: "Title",
          type: "text",
          name: "title",
          value: props.post?.title || "",
        },
        {
          text: "Post text",
          type: "textarea",
          name: "post_text",
          value: props.post?.post_text || "",
        },
        {
          text: "Group to post",
          type: "select",
          name: "group_id",
          options: [["", 0] , ...(groups || [])],
          value: String(props.post?.group_id) || "",
        },
      ]}
    >
      {post.data?.status === "error" && (
        <div className="bg-amber-2 color-zinc-8 p-1 border-rounded">
          {post.data?.text}
        </div>
      )}
    </SAForm>
  );
}
