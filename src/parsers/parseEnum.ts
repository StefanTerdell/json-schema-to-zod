export const parseEnum = (schema: any) => {
    return Array.isArray(schema.enum)
        ? `z.enum([${schema.enum.map((x: any) => typeof x === "string" ? `"${x}"` : x
        )}])`
        : `z.literal(${typeof schema.enum === "string" ? `"${schema.enum}"` : schema.enum})`;
};
