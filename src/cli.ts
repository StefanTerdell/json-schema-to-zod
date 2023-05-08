#!/usr/bin/env node
import { jsonSchemaToZod, jsonSchemaToZodDereffed } from "./jsonSchemaToZod";
import { readFileSync, writeFileSync, existsSync, mkdir } from "fs";
import { dirname } from "path";
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
  if (deref) {
    jsonSchemaToZodDereffed(sourceFileData, {
      name,
      module: true,
      withoutDefaults,
    })
      .catch((e) => {
        console.error("Failed to parse sourcefile content to Zod schema");
        console.error(e);
        process.exit(1);
      })
      .then((result) => {
        try {
          writeFileSync(targetFilePath, result);
        } catch (e) {
          console.error(`Failed to write result to ${targetFilePath}`);
          console.error(e);
          process.exit(1);
        }
      });
  } else {
    let result: string;
    try {
      result = jsonSchemaToZod(sourceFileData, {
        name,
        module: true,
        withoutDefaults,
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
  }
} else {
  if (deref) {
    jsonSchemaToZodDereffed(sourceFileData, {
      name,
      module: false,
      withoutDefaults,
    })
      .catch((e) => {
        console.error("Failed to parse sourcefile content to Zod schema");
        console.error(e);
        process.exit(1);
      })
      .then((result) => {
        console.log(result);
      });
  } else {
    let result: string;
    try {
      result = jsonSchemaToZod(sourceFileData, {
        name,
        module: false,
        withoutDefaults,
      });
    } catch (e) {
      console.error("Failed to parse sourcefile content to Zod schema");
      console.error(e);
      process.exit(1);
    }
    console.log(result);
  }
}
