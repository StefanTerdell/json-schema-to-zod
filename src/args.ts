import { statSync, readFileSync } from "fs";

export type Param = {
  name: string;
  short: string;
  description?: string;
  value?: "string" | "number" | string[];
  required?: boolean | string;
};

type Help = Partial<Pick<Param, "name" | "short" | "description">>;

export function parseArgs(
  params: Param[],
  args: string[],
  help?: boolean | Help,
): Record<string, string | number | boolean | undefined> {
  const result: Record<string, string | number | boolean> = {};

  if (help) {
    const defaults: Param = {
      name: "help",
      short: "h",
      description: "Display this message :)",
    };

    const param: Param =
      help === true
        ? defaults
        : {
            ...defaults,
            ...help,
          };

    let index = args.indexOf("--" + param.name);

    if (index === -1) {
      index = args.indexOf("-" + param.short);
    }

    if (index !== -1) {
      printParams([...params, param]);
      process.exit(0);
    }
  }

  for (const param of params) {
    let index = args.indexOf("--" + param.name);

    if (index === -1) {
      index = args.indexOf("-" + param.short);
    }

    if (index === -1) {
      if (param.required) {
        throw new Error(
          typeof param.required === "string"
            ? param.required
            : `Missing required argument ${param.name}`,
        );
      }

      result[param.name] = false;

      continue;
    }

    if (param.value) {
      const value = args[index + 1];

      if (value === undefined) {
        throw new Error(`Expected a value for argument ${param.name}`);
      }

      if (param.value === "number") {
        const asNumber = Number(value);

        if (isNaN(asNumber)) {
          throw new Error(
            `Value of argument ${param.name} must be a valid number`,
          );
        }

        result[param.name] = asNumber;

        continue;
      }

      if (Array.isArray(param.value) && !param.value.includes(value)) {
        throw new Error(
          `Value of argument ${param.name} must be one of ${param.value}`,
        );
      }

      result[param.name] = value;
    } else {
      result[param.name] = true;
    }
  }

  return result;
}

export function parseOrReadJSON(jsonOrPath: string): unknown {
  jsonOrPath = jsonOrPath.trim();

  if (statSync(jsonOrPath, { throwIfNoEntry: false })?.isFile()) {
    jsonOrPath = readFileSync(jsonOrPath, "utf-8");
  }

  return JSON.parse(jsonOrPath);
}

export function readPipe(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let buf = "";

    process.stdin
      .setEncoding("utf-8")
      .on("end", () => resolve(buf))
      .on("error", reject)
      .on("readable", () => {
        let chunk: string | null;

        while ((chunk = process.stdin.read()) != null) {
          buf += chunk;
        }
      });
  });
}

export function printParams(params: Param[]): void {
  const longest = params.reduce(
    (n, p) => (p.name.length > n ? p.name.length : n),
    5,
  );
  const header = "Name " + " ".repeat(longest - 2) + "Short Description";

  console.log(header);

  for (const param of params) {
    console.log(
      "--" +
        param.name +
        " ".repeat(longest - param.name.length) +
        " -" +
        param.short +
        "    " +
        param.description ?? "",
    );
  }
}
