import { JSONSchema7 } from "json-schema";

export type ParserSelector = (schema: JSONSchema7, refs: Refs) => string;
export type ParserOverride = (schema: JSONSchema7, refs: Refs) => string | void;

export type Options = {
  name?: string;
  module?: boolean;
  withoutDefaults?: boolean;
  overrideParser?: ParserOverride;
  recursionDepth?: number;
};

export type Refs = Options & {
  path: (string | number)[];
  seen: Map<object | boolean, { n: number; r: string | undefined }>;
};
