import prettier from "prettier";
import babelParser from "prettier/parser-babel";

export const format = (source: string): string => prettier.format(source, {
    parser: "babel",
    plugins: [babelParser],
  })