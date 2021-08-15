import { z } from "zod";

z.object({
  myArray: z
    .array(z.string().regex(new RegExp("hej")).email())
    .min(2)
    .max(4)
    .optional(),
}).strip();
