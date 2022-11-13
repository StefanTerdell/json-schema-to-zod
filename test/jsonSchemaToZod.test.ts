import jsonSchemaToZod from '../src'

describe("jsonSchemaToZod", () => {
    it("should produce a string of JS code creating a Zod schema from a simple JSON schema", () => {
        expect(jsonSchemaToZod({
            type: "string"
        })).toStrictEqual(`import { z } from "zod";

export default z.string();
`)
    })
})