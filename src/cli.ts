#!/usr/bin/env node
import { jsonSchemaToZod } from "./jsonSchemaToZod.js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { parseArgs, parseOrReadJSON, readPipe } from "./args.js";
import { JsonSchema } from "./Types.js";
import { pick } from "./utils/pick.js";

const params = {
  input: {
    shorthand: "i",
    value: "string",
    required:
      process.stdin.isTTY &&
      "input is required when no JSON or file path is piped",
    description: "JSON or a source file path. Required if no data is piped.",
  },
  output: {
    shorthand: "o",
    value: "string",
    description:
      "A file path to write to. If not supplied stdout will be used.",
  },
  name: {
    shorthand: "n",
    value: "string",
    description: "The name of the schema in the output.",
  },
  depth: {
    shorthand: "d",
    value: "number",
    description:
      "Maximum depth of recursion before falling back to z.any(). Defaults to 0.",
  },
  module: {
    shorthand: "m",
    value: ["esm", "cjs", "none"],
    description: "Module syntax; 'esm', 'cjs' or 'none'. Defaults to 'esm'.",
  },
} as const;

async function main() {
  const args = parseArgs(params, process.argv, true);
  const input = args.input || (await readPipe());
  const jsonSchema = parseOrReadJSON(input);
  const zodSchema = jsonSchemaToZod(
    jsonSchema as JsonSchema,
    pick(args, "name", "depth", "module"),
  );

  if (args.output) {
    mkdirSync(dirname(args.output), { recursive: true });
    writeFileSync(args.output, zodSchema);
  } else {
    console.log(zodSchema);
  }
}

void main();
