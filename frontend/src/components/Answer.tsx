import { Link } from "react-router-dom";

import { useSearchByIdQuery } from "../store/user/user.api";

import SButton from "./shared/SButton";
import answer from "../store/types/answer";
import SText from "./shared/SText";
import PublishAnswer from "./PublishAnswer";
import { useState } from "react";
import useHasAccess from "../hooks/access";

export interface AnswerElement extends answer {
  children?: AnswerElement[];
  isOnly?: boolean;
  refetch: () => void;
}
export default function Answer(props: AnswerElement) {

  const { data: user } = useSearchByIdQuery(props.user_id);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  return (
    <div className="h-full w-full" id={`${props.id}_${props.user_id}`}>
      <div
        className={`bg-emerald-8 mx-auto ${
          props.parent_answer && !props.isOnly ? "p-2" : "p-4 w-4/5"
        }`}
      >
        <p>
          <Link
            className="color-amber-4 text-[1.2rem] decoration-none"
            to={`/profile/${user?.login}`}
          >
            {user?.login || ""}
          </Link>
        </p>
        <SText
          className="bg-emerald-9 p-2 break-all mt-2"
          text={props.answer_text}
        />
        <p className="text-right mt-1 text-[.9rem]">
          {new Date(props.updated_at).toLocaleDateString()}&nbsp;&nbsp;
          {new Date(props.updated_at).toLocaleTimeString().slice(0, 5)}
        </p>

        {visible && (
          <PublishAnswer
            post={props.post}
            parent_answer={props.id}
            answer_text={props.answer_text}
            refetch={() => {
              setTimeout(() => {
                props.refetch();
              }, 400);
              setVisible(false);
              setEdit(false);
            }}
            edit={edit}
          />
        )}
        {!props.isOnly && (
          <SButton
            className="my-0 p-0 mt--10 mb-3"
            onClick={() => {
              setVisible(!visible);
              setEdit(false);
            }}
          >
            Reply
          </SButton>
        )}
        {props.isOnly && (
          <Link to={`/post/${props.post}#${props.id}_${props.user_id}`}>
            <SButton className="my-0 p-0 mt--10 mb-3" onClick={() => {}}>
              Link
            </SButton>
          </Link>
        )}
        {useHasAccess(props.user_id) && (
          <SButton
            className="my-0 p-0 mt--10 mb-3 mx-2"
            onClick={() => {
              setVisible(!visible);
              setEdit(true);
            }}
          >
            Edit
          </SButton>
        )}
        {props.children && (
          <div className="pl-[1rem] border-solid border-l-2 border-0 border-emerald-5">
            {props.children.map((it: AnswerElement) => (
              <Answer {...it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
