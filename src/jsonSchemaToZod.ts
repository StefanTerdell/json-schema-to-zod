import { Options, JsonSchema } from "./Types.js";
import { parseSchema } from "./parsers/parseSchema.js";

export const jsonSchemaToZod = (
  schema: JsonSchema,
  { module, name, type, noImport, ...rest }: Options = {},
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
    result = `module.exports = ${name ? `{ ${JSON.stringify(name)}: ${result} }` : result}
`;

    if (!noImport) {
      result = `const { z } = require("zod")

${result}`;
    }
  } else if (module === "esm") {
    result = `export ${name ? `const ${name} =` : `default`} ${result}
`;

    if (!noImport) {
      result = `import { z } from "zod"

${result}`;
    }
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
