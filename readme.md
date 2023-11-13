# Json-Schema-to-Zod

[![NPM Version](https://img.shields.io/npm/v/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)
[![NPM Downloads](https://img.shields.io/npm/dw/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)

_Looking for the exact opposite? Check out [zod-to-json-schema](https://npmjs.org/package/zod-to-json-schema)_

## Summary

A runtime package and CLI tool to convert JSON schema (draft 4+) objects or files into Zod schemas in the form of JavaScript code.

Before v2 it used [`prettier`](https://www.npmjs.com/package/prettier) for formatting and [`json-refs`](https://www.npmjs.com/package/json-refs) to resolve schemas. To replicate the previous behaviour, please use their respective CLI tools.

Since v2 the CLI supports piped JSON.

## Usage

### Online

[Just paste your JSON schemas here!](https://stefanterdell.github.io/json-schema-to-zod-react/)

### CLI

#### Simplest example

> `npm i -g json-schema-to-zod`

> `json-schema-to-zod -i mySchema.json -o mySchema.ts`

#### Example with $refs resolved and output formatted

> `npm i -g json-schema-to-zod json-refs prettier`

> `json-refs resolve mySchema.json | json-schema-to-zod | prettier --parser typescript > mySchema.ts`

#### Options

| Flag       | Shorthand | Function                                                                                |
| ---------- | --------- | --------------------------------------------------------------------------------------- |
| `--input`  | `-i`      | JSON or a source file path (required if no data is piped)                               |
| `--output` | `-t`      | Target file name                                                                        |
| `--name`   | `-n`      | The name of the schema in the output                                                    |
| `--depth`  | `-d`      | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0. ` |
| `--module` | `-m`      | Force module syntax (`"esm"` or `"cjs"`)                                                |

### Programmatic

`jsonSchemaToZod` will output the full module code, including a Zod import. If you only need the Zod schema itself, try one of the parsers directly. If you need to deref your JSON schema, try using `json-refs` `resolve` function before passing in the schema.

```typescript
import { jsonSchemaToZod, parseSchema } from "json-schema-to-zod";

const myObject = {
  type: "object",
  properties: {
    hello: {
      type: "string",
    },
  },
} as const;

const module = jsonSchemaToZod(myObject);

const schema = parseSchema(myObject);
```

#### `module`

```typescript
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

#### `schema`

```typescript
z.object({ hello: z.string().optional() });
```

### Overriding a parser

You can pass a `ParserOverride` to the `overrideParser` option, which is a function that receives the current schema node and the reference object, and should return a string when it wants to replace a default output. If the default output should be used for the node, just return nothing.

### Use at Runtime

The output of this package is not meant to be used at runtime. JSON Schema and Zod does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as (Ajv)[https://ajv.js.org/] to validate your runtime values directly against the original JSON Schema.

That said, it's possible in most cases to use `eval`. Here's an example that you shouldn't use:

```typescript
const zodSchema = eval(jsonSchemaToZod({ type: "string" }, { module: "cjs" }));

zodSchema.safeParse("Please just use Ajv instead");
```
