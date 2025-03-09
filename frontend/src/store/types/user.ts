export default interface user {
  id: number;
  login: string;
  password?: string;
  info: string;
  role: string;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface serverUserResponse {
  status: string;
  token: string;
  user: user;
  admin: boolean;
  text?: string;
}

export interface userService {
  login?: string;
  password?: string;
  info?: string;
  role?: string;
}