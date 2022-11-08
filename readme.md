# Json-Schema-to-Zod

[![NPM Version](https://img.shields.io/npm/v/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)

## Summary

A very simple CLI tool to convert JSON schema (draft 4+) objects or files into Zod schemas. Uses Prettier for formatting for now.

## Usage

### Online

[Paste your schemas here](https://stefanterdell.github.io/json-schema-to-zod-react/)

### CLI

`json-schema-to-zod -s myJson.json -t mySchema.ts`

Options:

- --source/-s [source file name]
- --target/-t [(optional) target file name]
- --name/-n [(optional) schema name in output]
- --deref/-d [(optional) deref schemas before parsing]
- --defaults [(options) include default values]

### Programmatic

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

const result = jsonSchemaToZod(myObject);
console.log(result);

const zodSchema = parseSchema(myObject);
console.log(zodSchema);
```

### Expected output:

```
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

and

```
z.object({hello: z.string().optional()})
```
