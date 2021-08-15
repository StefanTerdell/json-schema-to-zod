import { parseSchema } from "../parseSchema";

export const parseArray = (schema: any) => {
    let r = !schema.items
        ? "z.array(z.any())"
        : `z.array(${parseSchema(schema.items)})`;
    if (schema.minItems !== undefined)
        r += `.min(${schema.minItems})`;
    if (schema.maxItems !== undefined)
        r += `.max(${schema.maxItems})`;
    return r;
};
