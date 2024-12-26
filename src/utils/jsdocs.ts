import { JsonSchemaObject } from "../Types";

export const expandJsdocs = (jsdocs: string): string =>
  `/**
${jsdocs.split("\n")
    .map(x => `* ${x}`)
    .join("\n")}
*/\n`;

export const addJsdocs = (schema: JsonSchemaObject, parsed: string): string => {
  const description = schema.description as string;
  if (!description) {
    return parsed;
  }

  return `\n${expandJsdocs(description)}${parsed}`;
}
