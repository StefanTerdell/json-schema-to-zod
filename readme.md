# Json-Schema-to-Zod

[![NPM Version](https://img.shields.io/npm/v/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)
[![NPM Downloads](https://img.shields.io/npm/dw/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)

_Looking for the exact opposite? Check out [zod-to-json-schema](https://npmjs.org/package/zod-to-json-schema)_

## Summary

A runtime package and CLI tool to convert JSON schema (draft 4+) objects or files into Zod schemas in the form of JavaScript code. Uses Prettier for formatting.

## Usage

### Online

[Just paste your JSON schemas here!](https://stefanterdell.github.io/json-schema-to-zod-react/)

### CLI

Installation:

> `npm i -g json-schema-to-zod`

Example:

> `json-schema-to-zod -s myJson.json -t mySchema.ts`

#### Options

| Flag                 | Shorthand | Function                                                                                |
| -------------------- | --------- | --------------------------------------------------------------------------------------- |
| `--source`           | `-s`      | Source file name (required)                                                             |
| `--target`           | `-t`      | Target file name                                                                        |
| `--name`             | `-n`      | The name of the schema in the output                                                    |
| `--deref`            | `-d`      | Uses `json-schema-ref-parser` to dereference the schema                                 |
| `--without-defaults` | `-wd`     | Ignore default values in the schema                                                     |
| `--recursionDepth`   | `-rd`     | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0. ` |
| `--module`           | `-m`      | Force module syntax (`"esm"` or `"cjs"`)                                                |

### Programmatic

`jsonSchemaToZod` will output the full module code, including a Zod import. If you only need the Zod schema itself, try one of the parsers directly. If you need to deref your JSON schema, try awaiting `jsonSchemaDereffed`.

```typescript
import { jsonSchemaToZod, parseSchema } from "json-schema-to-zod";

const myObject = {
  type: "object",
  properties: {
    hello: {
      type: "string",
    },
  },
};

const module = jsonSchemaToZod(myObject);

const schema = parseSchema(myObject);
```

`module`/`dereffed` =

```typescript
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

`schema` =

```typescript
z.object({ hello: z.string().optional() });
```

### At Runtime

The output of this package is not meant to be used at runtime. JSON Schema and Zod does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as (Ajv)[https://ajv.js.org/] to validate your runtime values directly against the original JSON Schema.

That said, it's possible to use `eval`. Here's an example that you shouldn't use:

```typescript
const zodSchema = eval(jsonSchemaToZod({ type: "string" }, { module: "cjs" }));

zodSchema.safeParse("Please just use Ajv instead");
```
