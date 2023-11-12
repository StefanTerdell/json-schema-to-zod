import { JsonRefsOptions, resolveRefs } from "json-refs"
import { Options, JSONSchemaDefinition } from "./Types"
import { parseSchema } from "./parsers/parseSchema"
import { format } from "./utils/format"

export const jsonSchemaToZodDereffed = async (
  schema: JSONSchemaDefinition,
  options?: Options & { jsonRefsOptions?: JsonRefsOptions },
): Promise<string> => {
  if (typeof schema === "boolean") {
    return jsonSchemaToZod(schema, options)
  }

  schema = (
    await resolveRefs(
      schema,
      options?.jsonRefsOptions ??
        (options?.recursionDepth ? { resolveCirculars: true } : undefined),
    )
  ).resolved

  return jsonSchemaToZod(schema, options)
}

export const jsonSchemaToZod = (
  schema: JSONSchemaDefinition,
  { module = true, name, ...rest }: Options = {},
): string => {
  let result = parseSchema(schema, {
    module,
    name,
    path: [],
    seen: new Map(),
    ...rest,
  })

  if (module) {
    if (module === "cjs") {
      result = `
        const { z } = require('zod')

        module.exports = ${
          name ? `{ ${JSON.stringify(name)}: ${result} }` : result
        }
      `
    } else {
      result = `
        import { z } from 'zod'

        export ${name ? `const ${name} =` : `default`} ${result}
      `
    }
  } else {
    result = `const ${name || "schema"} = ${result}`
  }

  return format(result)
}
