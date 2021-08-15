import { JSONSchema7 } from "json-schema";
import { format } from "prettier";
import { parseSchema } from "./parseSchema";


export const jsonSchemaToZod = (schema: JSONSchema7): string => format(`import {z} from 'zod'\n\n${parseSchema(schema)}`);
