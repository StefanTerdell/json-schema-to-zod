import { Options, JsonSchema } from "./Types.js";
import { parseSchema } from "./parsers/parseSchema.js";

export const jsonSchemaToZod = (
  schema: JsonSchema,
  { module, name, type, ...rest }: Options = {},
): string => {
  if (type && (!name || module !== "esm")) {
    throw new Error(
      "Option `type` requires `name` to be set and `module` to be `esm`",
    );
  }

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

  if (type && name) {
    let typeName =
      typeof type === "string"
        ? type
        : `${name[0].toUpperCase()}${name.substring(1)}`;

    result += `export type ${typeName} = z.infer<typeof ${name}>
`;
  }

  return result;
};
