# Json-Schema-to-Zod

[![NPM Version](https://img.shields.io/npm/v/json-schema-to-zod.svg)](https://npmjs.org/package/json-schema-to-zod)

## Summary

A very simple CLI tool to convert JSON schema objects or files into Zod schemas. Uses Prettier for formatting for now.

## Usage

### CLI

`json-schema-to-zod -s myJson.json -t mySchema.ts`

Options:

- --source/-s [source file name]
- --target/-t [(optional) target file name]
- --name/-n [(optional) schema name in output]

### Programmatic

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

const result = jsonSchemaToZod(myObject);

console.log(result);
```

### Expected output:

```
const schema = z.object({hello: z.string()});
```
