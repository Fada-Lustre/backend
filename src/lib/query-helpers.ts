import { ApplicationError } from "../errors";

interface QueryState {
  conditions: string[];
  params: (string | number)[];
  idx: number;
}

export function addSearchFilter(
  state: QueryState,
  columns: string[],
  term: string | undefined
): void {
  if (!term) return;
  const clauses = columns.map((col) => `${col} ILIKE $${state.idx}`).join(" OR ");
  state.conditions.push(`(${clauses})`);
  state.params.push(`%${term}%`);
  state.idx++;
}

export function buildUpdateSet(
  updates: Record<string, unknown>
): { sets: string[]; params: (string | number)[]; nextIdx: number } {
  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(updates)) {
    if (val !== undefined) {
      sets.push(`${key} = $${idx++}`);
      params.push(val as string | number);
    }
  }
  return { sets, params, nextIdx: idx };
}

export function firstOr404<T>(rows: T[], message: string): T {
  if (rows.length === 0) {
    throw new ApplicationError(404, message, "NOT_FOUND");
  }
  return rows[0]!;
}

export function appendPagination(
  params: (string | number)[],
  idx: number,
  page: number,
  limit: number
): { limitPlaceholder: string; offsetPlaceholder: string; newIdx: number } {
  const offset = (page - 1) * limit;
  const limitPlaceholder = `$${idx}`;
  const offsetPlaceholder = `$${idx + 1}`;
  params.push(limit, offset);
  return { limitPlaceholder, offsetPlaceholder, newIdx: idx + 2 };
}
