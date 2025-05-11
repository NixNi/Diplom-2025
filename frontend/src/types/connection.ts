export interface Connection {
  id: number;
  name: string;
  ip: string;
  port: string;
}

export interface Connect {
  ip: string | null;
  port: string | null;
}
