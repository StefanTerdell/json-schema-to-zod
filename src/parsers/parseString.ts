export const parseString = (schema: any) => {
    let r = "z.string()";
    if (schema.pattern)
        r += `.regex(new RegExp("${schema.pattern}"))`;
    if (schema.format === "email")
        r += ".email()";
    else if (schema.format === "uri")
        r += ".url()";
    else if (schema.format === "uuid")
        r += ".uuid()";
    return r;
};
