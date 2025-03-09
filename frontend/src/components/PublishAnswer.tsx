import SInput from "../components/shared/SInput";
import SButton from "../components/shared/SButton";
import { useAddAnswerMutation, useEditAnswerMutation} from "../store/answer/answer.api";
import { useState } from "react";
import { answerService } from "../store/types/answer";
import { useAppSelector } from "../hooks/redux";
import { useLocation, useNavigate } from "react-router";

export default function PublishAnswer(props: answerService & { refetch: () => void; edit: boolean; }) {
  const navigator = useNavigate();
  const location = useLocation();
  const User = useAppSelector((state) => state.user);
  const [publishAnswer] = useAddAnswerMutation();
  const [editAnswer] = useEditAnswerMutation()
  const [text, setText] = useState<string>(props.edit && props.answer_text || "");
  const pAnswer = function () {
    if (!User.id) navigator(`/login?redirectTo=${location.pathname}`);
    if (text != "") {
      if (!props.edit) publishAnswer({
        user_id: User.id,
        post: props.post,
        parent_answer: props.parent_answer || null,
        answer_text: text,
      });
      else editAnswer({
        id: props.parent_answer || 0,
        answer_text: text,
      });
      props.refetch();
      setText("")
    }
      
  };
  return (
    <div className="flex justify-center items-center gap-5">
      <SInput
        className="w-3/5 p-1 border border-white"
        onChange={(e) => {
          setText(e.target.value);
        }}
        value={text}
      />
      <SButton onClick={pAnswer}>Send</SButton>
    </div>
  );
}
