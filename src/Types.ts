import { JSONSchema7 } from "json-schema";

export type ParserSelector = (schema: JSONSchema7, refs: Refs) => string;
export type ParserOverride = (schema: JSONSchema7, refs: Refs) => string | void;

export type Options = {
  name?: string;
  module?: boolean;
  withoutDefaults?: boolean;
  overrideParser?: ParserOverride;
};

export type Refs = Options & {
  path: (string | number)[];
};
