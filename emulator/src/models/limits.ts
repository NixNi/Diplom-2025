import db from "../services/SQLiteConnection";

export async function getAllLimits() {
  const query = db.query("SELECT Parameter, Min, Max FROM limits");
  const result = query.all() as {
    Min: number;
    Max: number;
    Parameter: string;
  }[];
  const mappedResult = result.reduce(
    (
      acc: Record<
        string,
        {
          min: number;
          max: number;
        }
      >,
      rec
    ) => {
      acc[rec.Parameter] = { min: rec.Min, max: rec.Max };
      return acc;
    },
    {}
  );
  return mappedResult;
}

export async function getLimits(parameter: string) {
  const query = db.prepare("SELECT Min, Max FROM limits WHERE Parameter = ?");
  const result = query.get(parameter) as {
    Min: number;
    Max: number;
  } | null;
  return result ? result : null;
}
