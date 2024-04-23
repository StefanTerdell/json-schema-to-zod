import { JsonSchemaObject } from "../Types.js";
import { withMessage } from "../utils/withMessage.js";

export const parseString = (schema: JsonSchemaObject & { type: "string" }) => {
  let r = "z.string()";

  r += withMessage(schema, "format", ({ value }) => {
    switch (value) {
      case "email":
        return [".email(", ")"];
      case "ip":
        return [".ip(", ")"];
      case "ipv4":
        return ['.ip({ version: "v4"', ", message: ", " })"];
      case "ipv6":
        return ['.ip({ version: "v6"', ", message: ", " })"];
      case "uri":
        return [".url(", ")"];
      case "uuid":
        return [".uuid(", ")"];
      case "date-time":
        return [".datetime(", ")"];
      case "time":
        return [".time(", ")"];
      case "date":
        return [".date(", ")"];
      case "binary":
        return [".base64(", ")"];
      case "duration":
        return [".duration(", ")"];
    }
  });

  r += withMessage(schema, "contentEncoding", ({ value }) => {
    if (value === "base64") {
      return [".base64(", ")"];
    }
  });

  r += withMessage(schema, "pattern", ({ json }) => [
    `.regex(new RegExp(${json})`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "minLength", ({ json }) => [
    `.min(${json}`,
    ", ",
    ")",
  ]);

  r += withMessage(schema, "maxLength", ({ json }) => [
    `.max(${json}`,
    ", ",
    ")",
  ]);

  return r;
};
