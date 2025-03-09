import { Link, useLocation } from "react-router-dom";
import post from "../store/types/post";
import { useSearchByIdQuery } from "../store/user/user.api";
import { useGetGroupByIdQuery } from "../store/group/group.api";
import SButton from "./shared/SButton";
import SText from "./shared/SText";
import { useGetAnswersByPostyIdQuery } from "../store/answer/answer.api";
import useHasAccess from "../hooks/access";
import PopUp from "./PopUp";
import { useState } from "react";
import CreatePost from "../pages/CreatePost";
import { useDeletePostMutation } from "../store/post/post.api";

export default function Post(props: post & { refetch?: () => void; }) {
  const { data: user } = useSearchByIdQuery(props.user_id);
  const { data: group } = useGetGroupByIdQuery(props.group_id || 0, {skip:!props.group_id});
  const { data: answers } = useGetAnswersByPostyIdQuery(props.id);
  const [deletePost] = useDeletePostMutation()
  const [popUp, setPopUp] = useState(false);
  const Location = useLocation(); 
  const isPost = Location.pathname.includes("post");
  const deleteP = function() {
    deletePost(props.id)
    window.location.reload()
  }

  return (
    <div className="h-full w-full">
      <div className="bg-emerald-8 p-4 w-[80%] mx-auto">
        <p>
          <Link
            className="color-amber-4 text-[1.2rem] decoration-none"
            to={`/profile/${user?.login}`}
          >
            {user?.login || ""}
          </Link>
          {props.group_id && (
            <span>
              &nbsp;&nbsp;&nbsp;in&nbsp;&nbsp;&nbsp;
              <Link
                className="color-amber-4 text-[1.2rem] decoration-none"
                to={`/group/${group?.name}`}
              >
                {group?.name || ""}
              </Link>
            </span>
          )}
        </p>
        <h2>{props.title}</h2>
        <SText
          text={props.post_text}
          className="bg-emerald-9 p-2 break-all mt-2"
        />
        <p className="text-right mt-1">
          {new Date(props.updated_at).toLocaleDateString()}&nbsp;&nbsp;
          {new Date(props.updated_at).toLocaleTimeString().slice(0, 5)}
        </p>
        {!isPost && (
          <Link to={`/post/${props.id}`}>
            <SButton className="my-0 mt--10">
              {answers?.length} Comments
            </SButton>
          </Link>
        )}
        {useHasAccess(props.user_id) && (
          <span>
            <SButton
              className="mx-2 my-0 mt--10"
              onClick={() => setPopUp(true)}
            >
              Edit
            </SButton>
            <SButton onClick={deleteP}>Delete</SButton>
          </span>
        )}

        <PopUp toggle={setPopUp} isOpen={popUp} refetch={props.refetch}>
          <CreatePost edit={true} post={props} />
        </PopUp>
      </div>
    </div>
  );
}
