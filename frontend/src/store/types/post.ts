export default interface post {
  id: number;
  user_id: number;
  group_id: number;
  post_text: string;
  title: string;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface postService {
  user_id?: number;
  group_id?: number;
  post_text?: string;
  title?: string;
}