import { writeFileSync } from "fs";
import { jsonSchemaToZod } from "../jsonSchemaToZod";

writeFileSync(
    "output.ts",
    jsonSchemaToZod({
        $schema: "https://json-schema.org/draft/2019-09/schema",
        type: "object",
        properties: {
            myArray: {
                type: "array",
                items: { type: "string", pattern: "hej", format: "email" },
                minItems: 2,
                maxItems: 4,
            },
        },
    })
);
