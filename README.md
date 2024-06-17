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

| Flag       | Shorthand | Function                                                                                     |
| ---------- | --------- | -------------------------------------------------------------------------------------------- |
| `--input`  | `-i`      | JSON or a source file path. Required if no data is piped.                                    |
| `--output` | `-t`      | A file path to write to. If not supplied stdout will be used.                                |
| `--name`   | `-n`      | The name of the schema in the output                                                         |
| `--depth`  | `-d`      | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0.        |
| `--module` | `-m`      | Module syntax; `esm`, `cjs` or none. Defaults to `esm` in the CLI and `none` programmaticly. |

### Programmatic

#### Simple example

```typescript
import { jsonSchemaToZod } from "json-schema-to-zod";

const myObject = {
  type: "object",
  properties: {
    hello: {
      type: "string",
    },
  },
};

const module = jsonSchemaToZod(myObject, { module: "esm" });

const cjs = jsonSchemaToZod(myObject, { module: "cjs", name: "mySchema" });

const schema = jsonSchemaToZod(myObject);
```

##### `module`

```typescript
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

##### `cjs`

```typescript
const { z } = require("zod");

module.exports = { mySchema: z.object({ hello: z.string().optional() }) };
```

##### `schema`

```typescript
z.object({ hello: z.string().optional() });
```

### ⚠ if you have "refs" in your json:
#### Resolved and formatted () 

```typescript
import { z } from "zod"
import { resolveRefs } from "json-refs"
import { format } from "prettier"
import jsonSchemaToZod from "json-schema-to-zod"

async function example(jsonSchema: any) {
  const { resolved }= await resolveRefs(jsonSchema)
  const code = jsonSchemaToZod(resolved)
  const formatted = await format(code, { parser: "typescript" })

  return formatted
}
```

#### Overriding a parser

You can pass a function to the `overrideParser` option, which represents a function that receives the current schema node and the reference object, and should return a string when it wants to replace a default output. If the default output should be used for the node just return void.

#### Use at Runtime

The output of this package is not meant to be used at runtime. JSON Schema and Zod does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as [Ajv](https://ajv.js.org/) to validate your runtime values directly against the original JSON Schema.

That said, it's possible in most cases to use `eval`. Here's an example that you shouldn't use:

```typescript
const zodSchema = eval(jsonSchemaToZod({ type: "string" }, { module: "cjs" }));

zodSchema.safeParse("Please just use Ajv instead");
```
