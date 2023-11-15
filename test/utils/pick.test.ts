import { pick } from "../../src/utils/pick";
import { suite } from "../suite";

suite("pick", (test) => {
  test("pick", (assert) => {
    const input = {
      a: true,
      b: true,
    };

    pick(
      input,
      "a",
      // @ts-expect-error
      "c",
    );

    const output = pick(input, "a");

    // @ts-expect-error
    output.b;

    assert(output.a, true);

    // @ts-expect-error
    assert(output.b, undefined);
  });
});
