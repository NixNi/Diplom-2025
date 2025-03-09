import { Link, useParams } from "react-router-dom";
import {
  useBanUserMutation,
  useSearchByLoginQuery,
  useUnBanUserMutation,
} from "../store/user/user.api";
import Er404 from "../components/404";
import { useGroupsByUserQuery } from "../store/ugr/ugr.api";
import group from "../store/types/group";
import { useEffect, useState } from "react";
import SButton from "../components/shared/SButton";
import { useGetPostsByUserQuery } from "../store/post/post.api";
import Post from "../components/Post";
import PopUp from "../components/PopUp";
import CreatePost from "./CreatePost";
import CreateGroup from "./CreateGroup";
import { useHasAccessRestricted, useHasAdminAccess } from "../hooks/access";
import EditUser from "./EditUser";
import { useGetAnswersByUserIdQuery } from "../store/answer/answer.api";
import Answer from "../components/Answer";

export default function Profile() {
  const { username } = useParams();
  const user = useSearchByLoginQuery(username!);
  const groupsIDs = useGroupsByUserQuery(user.data?.id || 0);
  const { data: posts, refetch: postsRefetch } = useGetPostsByUserQuery(
    user.data?.id || 0
  );
  const canAccess = useHasAccessRestricted(user.data?.id || NaN);
  const isAdmin = useHasAdminAccess();
  const [groups, setGroups] = useState<group[]>([]);
  const [writePost, setWritePost] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [banUser] = useBanUserMutation();
  const [unBanUser] = useUnBanUserMutation();
  const { data: answers } = useGetAnswersByUserIdQuery(user.data?.id || 0);
  const Ban = function () {
    if (user.data)
      user.data.role == "BANNED" ? unBanUser(user.data) : banUser(user.data);
    window.location.reload();
  };
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (groupsIDs.data) {
          const groupPromises = groupsIDs.data.map(async (it) => {
            const response = await fetch(`../api/group/id/${it.group_id}`);
            const data: group = await response.json();
            return data;
          });

          const groupsData = await Promise.all(groupPromises);
          setGroups(groupsData);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [groupsIDs.data]);

  return (
    <div>
      {user.data && user.data.created_at && (
        <div>
          <div className="m-4 bg-emerald-8 flex justify-between items-center">
            <div>
              {" "}
              <h1 className="color-amber-4 mx-5 ">{user.data.login}</h1>
              <p className="mx-5 mb-2">
                Registered:{" "}
                {new Date(user.data.created_at).toLocaleDateString()}
              </p>
              <p className="mx-5 text-xl">{user.data.info}</p>
            </div>
            {isAdmin && user.data.role != "ADMIN" && (
              <SButton className="mr-2" onClick={Ban}>
                {user.data.role == "BANNED" ? "Unban user" : "Ban user"}
              </SButton>
            )}
            {canAccess && (
              <div className="mr-2">
                <SButton
                  onClick={() => {
                    setEditUser(true);
                  }}
                >
                  Edit
                </SButton>
                <SButton
                  onClick={() => {
                    setWritePost(true);
                  }}
                >
                  Write Post
                </SButton>
                <SButton
                  onClick={() => {
                    setCreateGroup(true);
                  }}
                >
                  Create Group
                </SButton>
                <PopUp
                  toggle={setWritePost}
                  isOpen={writePost}
                  refetch={postsRefetch}
                >
                  <CreatePost />
                </PopUp>
                <PopUp
                  toggle={setCreateGroup}
                  isOpen={createGroup}
                  refetch={groupsIDs.refetch}
                >
                  <CreateGroup />
                </PopUp>
                <PopUp
                  toggle={setEditUser}
                  isOpen={editUser}
                  refetch={user.refetch}
                >
                  <EditUser user={user.data} />
                </PopUp>
              </div>
            )}
          </div>
          <div className="m-4  bg-emerald-8">
            <h2 className="color-amber-4 mx-5">Groups</h2>
            <ul className="list-none max-h-[150px] overflow-y-auto scrollable-container custom-scrollbar">
              {groups &&
                groups.map((it) => {
                  return (
                    <li className="mt-1 px-4 bg-emerald-9" key={it.id}>
                      <Link
                        to={`../../group/${it.name}`}
                        className="flex justify-between color-zinc-2 decoration-none"
                      >
                        <div>
                          <h3>{it.name}</h3>
                          <p>
                            {it.description.slice(
                              0,
                              Math.min(50, it.description.length)
                            )}
                          </p>
                          <p>
                            Joined:{" "}
                            {new Date(
                              groupsIDs.data?.find(
                                (iit) => iit.group_id === it.id
                              )?.created_at || ""
                            ).toLocaleDateString() || ""}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="mt-5 flex flex-col gap-5 max-h-[400px] overflow-y-auto scrollable-container custom-scrollbar">
            {posts && posts.map((it) => <Post {...it} key={it.id} />)}
          </div>
        </div>
      )}
      {answers && (
        <div className="mt-10 flex flex-col gap-4 max-h-[200px] overflow-y-auto scrollable-container custom-scrollbar">
          {answers.map((answer) => (
            <Answer
              key={answer.id}
              {...answer}
              refetch={() => {}}
              isOnly={true}
            />
          ))}
        </div>
      )}
      {user.data?.status === "error" && <Er404 />}
    </div>
  );
}
