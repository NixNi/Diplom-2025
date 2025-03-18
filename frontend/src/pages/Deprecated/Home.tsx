
import Post from '../../components/Post';
import { useGetPostsSBDQuery } from '../store/post/post.api';

export default function Home() {
  const {data: posts, refetch}= useGetPostsSBDQuery()
  return (
    <div className='mt-5 flex flex-col gap-5'>
      {posts && posts.map((it) => <Post {...it} key={it.id} refetch={refetch}/>)}
    </div>
  );
}
