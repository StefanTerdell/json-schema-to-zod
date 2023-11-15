import { omit } from "../../src/utils/omit";
import { suite } from "../suite";

suite("omit", (test) => {
  test("omit", (assert) => {
    const input = {
      a: true,
      b: true,
    };

    omit(
      input,
      "b",
      // @ts-expect-error
      "c",
    );

    const output = omit(input, "b");

    // @ts-expect-error
    output.b;

    assert(output.a, true);

    // @ts-expect-error
    assert(output.b, undefined);
  });
});
