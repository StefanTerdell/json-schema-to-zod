export const parseNumber = (schema: any) => {
    let r = "z.number()";
    if (schema.format === "int64")
        r += ".int()";
    if (schema.min !== undefined)
        r += `.min(${schema.min})`;
    if (schema.max !== undefined)
        r += `.max(${schema.max})`;
    return r;
};
