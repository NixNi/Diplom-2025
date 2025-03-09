import { useParams } from "react-router";
import { useGetPostByIdQuery } from "../store/post/post.api";
import Post from "../components/Post";
import Er404 from "../components/404";
import PublishAnswer from "../components/PublishAnswer";
import { useGetAnswersByPostyIdQuery } from "../store/answer/answer.api";
import Answer, { AnswerElement } from "../components/Answer";
import answer from "../store/types/answer";
import { useEffect, useState } from "react";

export default function PostPage() {
  const { postid } = useParams();
  const { data: post, refetch: refetchPost } = useGetPostByIdQuery(Number(postid));
  const { data: answers, refetch: refetchAnswers } =
    useGetAnswersByPostyIdQuery(Number(postid));

  const [answersData, setAnswersData] = useState<AnswerElement[]>([]);
  function nestAnswers(answers: answer[]): AnswerElement[] {
    const answerMap: Record<number, AnswerElement> = {};

    answers.forEach((ans) => {
      answerMap[ans.id] = { ...ans, children: [], refetch: refetchAnswers };
    });

    const nestedAnswers: AnswerElement[] = [];

    answers.forEach((ans) => {
      if (ans.parent_answer !== null) {
        answerMap[ans.parent_answer].children?.push(answerMap[ans.id]);
      } else {
        nestedAnswers.push(answerMap[ans.id]);
      }
    });
    console.log(nestedAnswers)
    return nestedAnswers;
  }

  useEffect(() => {
    setAnswersData(nestAnswers(answers || []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  return (
    <div>
      {post?.status !== "error" && post && (
        <div className="mt-5">
          <Post {...post} refetch={refetchPost}/>
          <PublishAnswer
            post={post.id}
            refetch={() => {
              setTimeout(() => {
                refetchAnswers();
              }, 400);
            }}
            edit={false}
          />
          <div className="flex flex-col gap-4">
            {answersData.map((answer) => (
              <Answer key={answer.id} {...answer} />
            ))}
          </div>
        </div>
      )}
      {post?.status === "error" && <Er404 />}
    </div>
  );
}
