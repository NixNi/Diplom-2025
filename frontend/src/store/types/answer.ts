export default interface answer {
  id: number;
  user_id: number;
  answer_text: string;
  post: number;
  parent_answer: number | null;
  created_at: string;
  updated_at: string;
}

export interface answerService {
  id?: number;
  user_id?: number;
  answer_text?: string;
  post?: number;
  parent_answer?: number | null;
}