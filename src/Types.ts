export type Serializable =
  | { [key: string]: Serializable }
  | Serializable[]
  | string
  | number
  | boolean
  | null;

export type JsonSchema = JsonSchemaObject | boolean;
export type JsonSchemaObject = {
  // left permissive by design
  type?: string | string[];

  // object
  properties?: { [key: string]: JsonSchema };
  additionalProperties?: JsonSchema;
  unevaluatedProperties?: JsonSchema;
  patternProperties?: { [key: string]: JsonSchema };
  minProperties?: number;
  maxProperties?: number;
  required?: string[] | boolean;
  propertyNames?: JsonSchema;

  // array
  items?: JsonSchema | JsonSchema[];
  additionalItems?: JsonSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // string
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // number
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;

  // unions
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  oneOf?: JsonSchema[];

  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;

  // shared
  const?: Serializable;
  enum?: Serializable[];

  errorMessage?: { [key: string]: string | undefined };
} & { [key: string]: any };

export type ParserSelector = (schema: JsonSchemaObject, refs: Refs) => string;
export type ParserOverride = (
  schema: JsonSchemaObject,
  refs: Refs,
) => string | void;

export type Options = {
  name?: string;
  module?: "cjs" | "esm";
  withoutDefaults?: boolean;
  overrideParser?: ParserOverride;
  recursionDepth?: number;
};

export type Refs = Options & {
  path: (string | number)[];
  seen: Map<object | boolean, { n: number; r: string | undefined }>;
};
