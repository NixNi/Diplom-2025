export interface ServerResponse {
  status: string;
  message: string;
}

export interface ServerDataResponse<T> {
  status: string;
  message: string;
  data?: T;
}
