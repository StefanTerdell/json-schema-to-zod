#!/usr/bin/env node
import { jsonSchemaToZod } from "./jsonSchemaToZod.js";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { type Param, parseArgs, parseOrReadJSON, readPipe } from "./args.js";

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
      "Maximum depth of recursion before falling back to z.any() - defaults to 0",
  },
  {
    name: "module",
    short: "m",
    value: ["esm", "cjs"],
    description: "Force module syntax ('esm' or 'cjs')",
  },
];

async function main() {
  const args = parseArgs(params, process.argv, {});

  const input = (args.input as string) || (await readPipe());
  const jsonSchema = parseOrReadJSON(input);
  const zodSchema = jsonSchemaToZod(jsonSchema as any, {
    module: args.module as "esm" | "cjs",
    name: args.name as string,
    recursionDepth: args["recursion-depth"] as number,
  });

  if (args.output) {
    mkdirSync(dirname(args.output as string), { recursive: true });
    writeFileSync(args.output as string, zodSchema);
  } else {
    console.log(zodSchema);
  }
}

void main();
