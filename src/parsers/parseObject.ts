import { parseSchema } from "../parseSchema";

export const parseObject = (schema: any) => {
    return !schema.properties && typeof schema.additionalProperties === "object"
        ? `z.record(${parseSchema(schema.additionalProperties)})`
        : `z.object({${Object.entries(schema?.properties).map(
            ([k, v]) => `'${k}':${parseSchema(v)}${schema.required?.includes(k) ? ".required()" : ".optional()"}`
        )}})${schema.additionalProperties === true
            ? ".catchall(z.any())"
            : schema.additionalProperties === false
                ? ".strict()"
                : typeof schema.additionalProperties === "object"
                    ? `.catchall(${parseSchema(schema.additionalProperties)})`
                    : ".strip()"}`;
};
