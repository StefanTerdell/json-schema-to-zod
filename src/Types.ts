import {
  JSONSchema4,
  JSONSchema4Type,
  JSONSchema4TypeName,
  JSONSchema6,
  JSONSchema6Type,
  JSONSchema6TypeName,
  JSONSchema7,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema"

export type JSONSchema = (JSONSchema4 | JSONSchema7 | JSONSchema6) & {
  errorMessage?: { [key: string]: string | undefined }
}
export type JSONSchemaDefinition = JSONSchema | boolean
export type JSONSchemaType = JSONSchema4Type | JSONSchema7Type | JSONSchema6Type
export type JSONSchemaTypeName =
  | JSONSchema4TypeName
  | JSONSchema6TypeName
  | JSONSchema7TypeName

export type ParserSelector = (schema: JSONSchema, refs: Refs) => string
export type ParserOverride = (schema: JSONSchema, refs: Refs) => string | void

export type Options = {
  name?: string
  module?: boolean | "cjs" | "esm"
  withoutDefaults?: boolean
  overrideParser?: ParserOverride
  recursionDepth?: number
}

export type Refs = Options & {
  path: (string | number)[]
  seen: Map<object | boolean, { n: number; r: string | undefined }>
}
