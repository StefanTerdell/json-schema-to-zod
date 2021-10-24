import { JSONSchema7 } from "json-schema";
import { parseSchema } from "./parsers/parseSchema";

export const jsonSchemaToZod = (schema: JSONSchema7, name?: string): string =>
  format(
    `import {z} from 'zod'\n\nexport ${
      name ? `const ${name}=` : "default "
    }${parseSchema(schema)}`
  );
