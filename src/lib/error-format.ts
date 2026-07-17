/**
 * Turn tsoa's raw validation `fields` map into human-readable, field-level
 * messages. tsoa emits messages like:
 *   "invalid float number"
 *   "Could not match the union against any of the items. Issues: [{...should be one of the following; ['today']...}]"
 * which are confusing for API consumers. This normalizes them.
 */

export interface FormattedField {
  message: string;
  value?: unknown;
}

const ENUM_OPTION_RE = /should be one of the following;\s*\['?([^'\]]+)'?\]/g;

function humanizeFieldName(field: string): string {
  // "requestBody.email" -> "email", "period" -> "period"
  const leaf = field.split(".").pop() ?? field;
  return leaf.replace(/_/g, " ");
}

function humanizeMessage(field: string, rawMessage: string): string {
  const name = humanizeFieldName(field);

  // Enum / union mismatch — collect all allowed values.
  if (rawMessage.includes("Could not match the union") || rawMessage.includes("should be one of the following")) {
    const options = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = ENUM_OPTION_RE.exec(rawMessage)) !== null) {
      if (m[1]) options.add(m[1].trim());
    }
    if (options.size > 0) {
      return `${name} must be one of: ${Array.from(options).join(", ")}`;
    }
    return `${name} has an invalid value`;
  }

  if (/invalid (float|double) number/i.test(rawMessage)) return `${name} must be a valid number`;
  if (/invalid integer number/i.test(rawMessage)) return `${name} must be a valid integer`;
  if (/invalid ISO 8601|invalid date/i.test(rawMessage)) return `${name} must be a valid date`;
  if (/invalid boolean/i.test(rawMessage)) return `${name} must be true or false`;
  if (/'required'|is required/i.test(rawMessage)) return `${name} is required`;

  // Fallback: prefix with the field name if not already present.
  return rawMessage;
}

/**
 * @param fields tsoa ValidateError.fields — Record<string, { message, value }>
 * @returns { message, details } where message is a concise human summary
 */
export function formatTsoaValidation(fields: Record<string, FormattedField>): {
  message: string;
  details: Record<string, FormattedField>;
} {
  const details: Record<string, FormattedField> = {};
  const summaries: string[] = [];

  for (const [field, info] of Object.entries(fields)) {
    const friendly = humanizeMessage(field, info?.message ?? "is invalid");
    details[humanizeFieldName(field)] = { message: friendly, value: info?.value };
    summaries.push(friendly);
  }

  const message =
    summaries.length === 1
      ? summaries[0]!
      : `Validation failed: ${summaries.join("; ")}`;

  return { message, details };
}
