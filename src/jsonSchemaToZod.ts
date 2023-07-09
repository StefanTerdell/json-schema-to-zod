import { JsonRefsOptions, resolveRefs } from "json-refs";
import { JSONSchema7 } from "json-schema";
import { Options } from "./Types";
import { parseSchema } from "./parsers/parseSchema";
import { format } from "./utils/format";

export const jsonSchemaToZodDereffed = (
  schema: JSONSchema7,
  options?: Options & { jsonRefsOptions?: JsonRefsOptions }
): Promise<string> => {
  return resolveRefs(
    schema,
    options?.jsonRefsOptions ??
      (options?.recursionDepth ? { resolveCirculars: true } : undefined)
  ).then(({ resolved }) => jsonSchemaToZod(resolved as JSONSchema7, options));
};

export const jsonSchemaToZod = (
  schema: JSONSchema7,
  { module = true, name, ...rest }: Options = {}
): string => {
  return format(
    `${module ? `import {z} from 'zod'\n\nexport ` : ""}${
      name ? `const ${name}=` : module ? "default " : "const schema="
    }${parseSchema(schema, {
      module,
      name,
      ...rest,
      path: [],
      seen: new Map(),
    })}`
  );
};
