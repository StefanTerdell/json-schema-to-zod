#!/usr/bin/env node
import { jsonSchemaToZod } from "./jsonSchemaToZod";
import { readFileSync, writeFileSync, existsSync, mkdir } from "fs";
import { dirname } from "path";

let help = process.argv.indexOf("--help");
if (help === -1) {
  help = process.argv.indexOf("-h");
}

if (~help) {
  console.log(`| Flag                 | Shorthand | Function                                                                                |
| -------------------- | --------- | --------------------------------------------------------------------------------------- |
| \`--source\`           | \`-s\`      | Source file name (required)                                                             |
| \`--target\`           | \`-t\`      | Target file name                                                                        |
| \`--name\`             | \`-n\`      | The name of the schema in the output                                                    |
| \`--deref\`            | \`-d\`      | Uses \`json-schema-ref-parser\` to dereference the schema                                 |
| \`--without-defaults\` | \`-wd\`     | Ignore default values in the schema                                                     |
| \`--recursionDepth\`   | \`-rd\`     | Maximum depth of recursion in schema before falling back to \`z.any()\`. Defaults to 0. \` |
| \`--module\`           | \`-m\`      | Force module syntax (\`"esm"\` or \`"cjs"\`)                                                |`);

  process.exit(0);
}

let sourceArgumentIndex = process.argv.indexOf("--source");
if (sourceArgumentIndex === -1) {
  sourceArgumentIndex = process.argv.indexOf("-s");
}
if (sourceArgumentIndex === -1) {
  console.error(
    "Must supply source file with --source [filename] or -s [filename}"
  );
  process.exit(1);
}
const sourceFilePath = process.argv[sourceArgumentIndex + 1];
if (!sourceFilePath) {
  console.error(
    `No source path was provided after ${process.argv[sourceArgumentIndex]}`
  );
  process.exit(1);
}
const sourceFileExists = existsSync(sourceFilePath);
if (!sourceFileExists) {
  console.error(`${sourceFilePath} doesn't exist`);
  process.exit(1);
}
let sourceFileContent: string;
try {
  sourceFileContent = readFileSync(sourceFilePath, "utf-8");
} catch (e) {
  console.error("Failed to read sourcefile");
  console.error(e);
  process.exit(1);
}
let sourceFileData: any;
try {
  sourceFileData = JSON.parse(sourceFileContent);
} catch (e) {
  console.error("Failed to parse sourcefile contents");
  console.error(e);
  process.exit(1);
}
let targetArgumentIndex = process.argv.indexOf("--target");
if (targetArgumentIndex === -1) {
  targetArgumentIndex = process.argv.indexOf("-t");
}
let targetFilePath: string = "";
if (targetArgumentIndex !== -1) {
  targetFilePath = process.argv[targetArgumentIndex + 1];
  if (!targetFilePath) {
    console.error(
      `No target path was provided after ${process.argv[targetArgumentIndex]}`
    );
    process.exit(1);
  }
}
let nameArgumentIndex = process.argv.indexOf("--name");
if (nameArgumentIndex === -1) {
  nameArgumentIndex = process.argv.indexOf("-n");
}
let name: string = "schema";
if (nameArgumentIndex !== -1) {
  name = process.argv[nameArgumentIndex + 1];
  if (!name) {
    console.error(
      `No schema name was provided after ${process.argv[nameArgumentIndex]}`
    );
    process.exit(1);
  }
}
let deref =
  process.argv.indexOf("--deref") !== -1 || process.argv.indexOf("-d") !== -1;
let withoutDefaults =
  process.argv.indexOf("--without-defaults") !== -1 ||
  process.argv.indexOf("-wd") !== -1;
let recursionDepthArgIndex = process.argv.indexOf("--recursionDepth");
if (recursionDepthArgIndex === -1) {
  recursionDepthArgIndex = process.argv.indexOf("-rd");
}
let recursionDepth: number = 0;
if (recursionDepthArgIndex !== -1) {
  recursionDepth = Number(process.argv[recursionDepthArgIndex + 1]);
  if (isNaN(recursionDepth)) {
    console.error(
      `No number was provided after after ${process.argv[recursionDepthArgIndex]}`
    );
    process.exit(1);
  }
}
let modArgumentIndex = process.argv.indexOf("--module");
if (modArgumentIndex === -1) {
  modArgumentIndex = process.argv.indexOf("-m");
}
let mod: undefined | string = undefined;
if (modArgumentIndex !== -1) {
  mod = process.argv[modArgumentIndex + 1];
  if (!mod || (mod !== "cjs" && mod !== "esm")) {
    console.error(
      `Provided either 'cjs' or 'mod' after ${process.argv[modArgumentIndex]}`
    );
    process.exit(1);
  }
}
if (targetFilePath) {
  const targetFileDir = dirname(targetFilePath);
  try {
    mkdir(targetFileDir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  } catch (e) {
    console.error("Failed to create directory for target file");
    console.error(e);
    process.exit(1);
  }
  let result: string;
  try {
    result = jsonSchemaToZod(sourceFileData, {
      name,
      module: mod ?? true,
      withoutDefaults,
      recursionDepth,
    });
  } catch (e) {
    console.error("Failed to parse sourcefile content to Zod schema");
    console.error(e);
    process.exit(1);
  }

  try {
    writeFileSync(targetFilePath, result);
  } catch (e) {
    console.error(`Failed to write result to ${targetFilePath}`);
    console.error(e);
    process.exit(1);
  }
} else {
  let result: string;
  try {
    result = jsonSchemaToZod(sourceFileData, {
      name,
      module: mod ?? false,
      withoutDefaults,
    });
  } catch (e) {
    console.error("Failed to parse sourcefile content to Zod schema");
    console.error(e);
    process.exit(1);
  }
  console.log(result);
}
