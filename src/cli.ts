#!/usr/bin/env node
import { jsonSchemaToZod } from "./jsonSchemaToZod.js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { type Param, parseArgs, parseOrReadJSON, readPipe } from "./args.js";
import { JsonSchema } from "./Types.js";

const params: Param[] = [
  {
    name: "input",
    short: "i",
    value: "string",
    required:
      process.stdin.isTTY &&
      "input is required when no JSON or file path is piped",
    description: "JSON or a source file path",
  },
  {
    name: "output",
    short: "o",
    value: "string",
    description:
      "A file path to write to. If not supplied output will be stdout",
  },
  {
    name: "name",
    short: "n",
    value: "string",
    description: "The name of the schema in the output",
  },
  {
    name: "depth",
    short: "d",
    value: "number",
    description:
      "Maximum depth of recursion before falling back to any (defaults to 0)",
  },
  {
    name: "module",
    short: "m",
    value: ["esm", "cjs", "none"],
    description: "Module syntax ('esm', 'cjs' or 'none', defaults to 'esm')",
  },
];

async function main() {
  const args = parseArgs(params, process.argv, {});

  const input = typeof args.input === "string" ? args.input : await readPipe();

  const jsonSchema = parseOrReadJSON(input);

  const zodSchema = jsonSchemaToZod(jsonSchema as JsonSchema, {
    module:
      args.module === "none"
        ? undefined
        : args.module === "cjs"
        ? "cjs"
        : "esm",
    name: typeof args.name === "string" ? args.name : undefined,
    recursionDepth: typeof args.depth === "number" ? args.depth : undefined,
  });

  if (typeof args.output === "string") {
    mkdirSync(dirname(args.output), { recursive: true });
    writeFileSync(args.output, zodSchema);
  } else {
    console.log(zodSchema);
  }
}

void main();
