import db from "src/services/SQLiteConnection";
import type { Connection } from "src/types/connection";

export async function getConnectionsPaginated(page: number, perPage: number) {
  const offset = (page - 1) * perPage;
  const query = db.query(`SELECT * FROM connections LIMIT ? OFFSET ?`);
  const result = query.all(perPage, offset) as Connection[];
  return result;
}

export async function updateConnectionById(
  id: number,
  name: string,
  ip: string,
  port: string
) {
  const query = db.query(
    `UPDATE connections SET name = ?, ip = ?, port = ? WHERE id = ?`
  );
  try {
    query.run(name, ip, port, id);
  } catch (e: any) {
    throw Error(e.message);
  }
}

export async function addConnection(name: string, ip: string, port: string) {
  const query = db.query(
    `INSERT INTO connections (name, ip, port) VALUES (?, ?, ?)`
  );
  try {
    query.run(name, ip, port);
  } catch (e: any) {
    throw Error(e.message);
  }
}

export async function deleteConnectionById(id: number) {
  const query = db.query(`DELETE FROM connections WHERE id = ?`);
  query.run(id);
}
