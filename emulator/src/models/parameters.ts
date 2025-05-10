import db from "../services/SQLiteConnection";
import type { Command } from "../types/command";
import { getLimits } from "./limits";

export async function getAllParameters() {
  const query = db.query("SELECT Parameter, Value FROM parameters");
  const result = query.all() as { Value: number; Parameter: string }[];
  // const mappedResult = result.reduce((acc: Record<string, number>, rec) => {
  //   acc[rec.Parameter] = rec.Value;
  //   return acc;
  // }, {});
  return result;
}

export async function getParameter(parameter: string) {
  const query = db.prepare("SELECT Value FROM parameters WHERE Parameter = ?");
  const result = query.get(parameter) as { Value: number } | null;
  return result ? result.Value : null;
}

export async function setParameter(
  parameter: string,
  value: number
): Promise<Command | null> {
  const limits = await getLimits(parameter);
  const numValue = Number(value);

  if (isNaN(numValue)) {
    throw new Error(`Значение ${value} не является числом`);
  }

  if (limits) {
    if (numValue < limits.Min) return null;
    if (numValue > limits.Max) return null;
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO parameters (Parameter, Value)
    VALUES (?, ?)
  `);
  const changes = insert.run(parameter, numValue);
  if (changes.changes) {
    return { command: "set", path: parameter, value: numValue };
  }
  return null;
}

export async function changeParameter(
  parameter: string,
  value: number
): Promise<Command | null> {
  const currentValue = (await getParameter(parameter)) || 0;
  const limits = await getLimits(parameter);
  console.log(currentValue, limits);
  const numValue = Number(value);
  if (isNaN(numValue)) {
    throw new Error(`Значение ${value} не является числом`);
  }

  if (limits) {
    if (currentValue + numValue < limits.Min) return null;
    if (currentValue + numValue > limits.Max) return null;
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO parameters (Parameter, Value)
    VALUES (?, ?)
  `);
  const changes = insert.run(parameter, currentValue + numValue);
  if (changes.changes) {
    return {
      command: "set",
      path: parameter,
      value: Number((currentValue + numValue).toFixed(2)),
    };
  }
  return null;
}
