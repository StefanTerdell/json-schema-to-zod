import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Refs } from "../Types";
import { its, parseSchema } from "./parseSchema";

export const parseAnyOf = (
	schema: JSONSchema7 & { anyOf: JSONSchema7Definition[] },
	refs: Refs
) => {
	if (!schema.anyOf.length) {
		return "z.any()";
	} else if (schema.anyOf.length === 1) {
		return parseSchema(schema.anyOf[0], {
			...refs,
			path: [...refs.path, "anyOf", 0],
		});
	} else {
		let typeFiltered = schema.anyOf.filter((type) =>
			typeof type === "object" ? !its.a.primitive(type, "null") : true
		);
		let hasNull = typeFiltered.length < schema.anyOf.length;
		let only = typeFiltered.length === 1 ? typeFiltered[0] : null;
		if (only) {
			return `${parseSchema(only, {
				...refs,
				path: [...refs.path, "anyOf", 0],
			})}.nullable()`;
		}
		return `z.union([${schema.anyOf.map((schema, i) =>
			parseSchema(schema, { ...refs, path: [...refs.path, "anyOf", i] })
		)}])${hasNull ? '.nullable()' : ''}`;
	}
};
