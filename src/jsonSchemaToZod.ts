import { Options, JsonSchema } from "./Types.js";
import { parseSchema } from "./parsers/parseSchema.js";

export const jsonSchemaToZod = (
  schema: JsonSchema,
  { module, name, ...rest }: Options = {},
): string => {
  let result = parseSchema(schema, {
    module,
    name,
    path: [],
    seen: new Map(),
    ...rest,
  });

  if (module === "cjs") {
    result = `const { z } = require("zod")

module.exports = ${name ? `{ ${JSON.stringify(name)}: ${result} }` : result}
`;
  } else if (module === "esm") {
    result = `import { z } from "zod"

export ${name ? `const ${name} =` : `default`} ${result}
`;
  } else if (name) {
    result = `const ${name} = ${result}`;
  }

  return result;
};
