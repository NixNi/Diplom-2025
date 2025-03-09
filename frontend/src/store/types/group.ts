export default interface group {
  id: number;
  name: string;
  description: string;
  owner: number;
  created_at: string;
  updated_at: string;
  status?: string;
}

export interface groupService {
  id?: number;
  name?: string;
  description?: string;
  owner?: string;
}