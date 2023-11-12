import { JSONSchema } from "../Types"

type Opener = string
type MessagePrefix = string
type Closer = string

type Builder = [Opener, Closer] | [Opener, MessagePrefix, Closer]

export function withMessage(
  schema: JSONSchema,
  key: string,
  get: (props: { value: unknown; json: string }) => Builder | void,
) {
  const value = schema[key as keyof typeof schema]

  let r = ""

  if (value !== undefined) {
    const got = get({ value, json: JSON.stringify(value) })

    if (got) {
      const opener = got[0]
      const prefix = got.length === 3 ? got[1] : ""
      const closer = got.length === 3 ? got[2] : got[1]

      r += opener

      if (schema.errorMessage?.[key] !== undefined) {
        r += prefix + JSON.stringify(schema.errorMessage[key])
      }
r
      r += closer
    }
  }

  return r
}
