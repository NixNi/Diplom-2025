import { useLocation, useNavigate, useParams } from "react-router";
import Er404 from "../components/404";
import { useGetGroupByNameQuery } from "../store/group/group.api";
import SButton from "../components/shared/SButton";
import { useAppSelector } from "../hooks/redux";
import {
  useAddGroupUserMutation,
  useGroupsByUserQuery,
  useRemoveGroupUserMutation,
} from "../store/ugr/ugr.api";
import { useState, useEffect } from "react";
import { useGetPostsByGroupQuery } from "../store/post/post.api";
import Post from "../components/Post";
import useHasAccess from "../hooks/access";
import PopUp from "../components/PopUp";
import CreateGroup from "./CreateGroup";

export default function Group() {
  const navigator = useNavigate();
  const location = useLocation();
  const { groupname } = useParams();
  const group = useGetGroupByNameQuery(groupname!);
  const User = useAppSelector((state) => state.user);
  const groupsIDs = useGroupsByUserQuery(User.id || 0);
  const { data: posts, refetch: postRefetch } = useGetPostsByGroupQuery(
    group.data?.id || 0
  );
  const [buttonText, setButtonText] = useState("Join");
  const [addGroupFun] = useAddGroupUserMutation();
  const [removeGroupFun] = useRemoveGroupUserMutation();
  const canEdit = useHasAccess(group.data?.owner || NaN);
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    if (User.id && groupsIDs.data?.some((it) => it.group_id === group.data?.id))
      setButtonText("Leave");
    else setButtonText("Join");
  }, [User.id, groupsIDs.data, group.data?.id]);

  const SwitchJoin = function () {
    if (!User.id) navigator(`/login?redirectTo=${location.pathname}`);
    else {
      if (group.data?.id) {
        if (buttonText == "Join") {
          addGroupFun(group.data.id);
          setButtonText("Leave");
        } else {
          removeGroupFun(group.data.id);
          setButtonText("Join");
        }
        groupsIDs.refetch();
      }
    }
  };

  return (
    <div>
      {group.data?.id && (
        <div>
          <div className="m-2 p-2 bg-emerald-8 flex justify-between items-center">
            <div>
              <h1 className="color-amber-4">{group.data?.name}</h1>
              <h3>{group.data?.description}</h3>
              <p className="mt-1">
                Created: {new Date(group.data.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <SButton onClick={() => setPopUp(true)}>Edit</SButton>
              )}
              <SButton onClick={SwitchJoin}>{buttonText}</SButton>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-5">
            {posts &&
              posts.map((it) => (
                <Post {...it} key={it.id} refetch={postRefetch} />
              ))}
          </div>
        </div>
      )}
      {group.data?.status === "error" && <Er404 />}
      <PopUp toggle={setPopUp} isOpen={popUp} refetch={() => { group.refetch(); postRefetch()}}>
        <CreateGroup edit={true} group={group.data} />
      </PopUp>
    </div>
  );
}
