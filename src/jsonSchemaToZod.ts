import { JSONSchema7 } from "json-schema";
import { format } from "prettier";
import { parseSchema } from "./parseSchema";

export const jsonSchemaToZod = (schema: JSONSchema7, name?: string): string =>
  format(
    `import {z} from 'zod'\n\nexport ${
      name ? `const ${name}=` : "default "
    }${parseSchema(schema)}`
  );
