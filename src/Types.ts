import { JSONSchema7 } from "json-schema";

export type ParserSelector = (
  schema: JSONSchema7Extended,
  refs: Refs
) => string;

export type ParserOverride = (
  schema: JSONSchema7Extended,
  refs: Refs
) => string | void;

export type JSONSchema7Extended = JSONSchema7 & {
  discriminator?: {
    propertyName: string;
  };
};

export type Options = {
  name?: string;
  module?: boolean | "cjs" | "esm";
  withoutDefaults?: boolean;
  overrideParser?: ParserOverride;
  recursionDepth?: number;
};

export type Refs = Options & {
  path: (string | number)[];
  seen: Map<object | boolean, { n: number; r: string | undefined }>;
};
