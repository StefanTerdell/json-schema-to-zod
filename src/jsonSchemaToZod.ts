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
  let result = parseSchema(schema, {
    module,
    name,
    path: [],
    seen: new Map(),
    ...rest,
  });

  if (module) {
    if (module === "cjs") {
      result = `
        const { z } = require('zod')
        module.exports = ${
          name ? `{ ${JSON.stringify(name)}: ${result} }` : result
        }
      `;
    } else {
      result = `
        import { z } from 'zod'
        export ${name ? `const ${name} =` : `default`} ${result}
      `;
    }
  } else {
    result = `const ${name || "schema"} = ${result}`;
  }

  return format(result);
};
