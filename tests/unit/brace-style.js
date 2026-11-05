import { format } from "../../src/index.js";

const javascriptInput =
  "function example(value) { if (value) { return true; } else { return false; } }";

test("defaults JavaScript block braces to the next line", async () => {
  expect(await format(javascriptInput, { parser: "babel" }))
    .toBe(`function example(value)
{
  if (value)
  {
    return true;
  }
  else
  {
    return false;
  }
}
`);
});

test("supports same-line JavaScript block braces", async () => {
  expect(
    await format(javascriptInput, {
      braceStyle: "same-line",
      parser: "babel",
    }),
  ).toBe(`function example(value) {
  if (value) {
    return true;
  } else {
    return false;
  }
}
`);
});

test("defaults TypeScript class and method braces to the next line", async () => {
  expect(
    await format("class Example { method(value: number) { return value; } }", {
      parser: "typescript",
    }),
  ).toBe(`class Example
{
  method(value: number)
  {
    return value;
  }
}
`);
});

test("defaults JavaScript object, pattern, import, and type braces to the next line", async () => {
  expect(
    await format(
      `import { alpha } from "example";
const value = { nested: { enabled: true }, empty: {} };
const { nested } = value;
type Settings = { enabled: boolean };`,
      { parser: "typescript" },
    ),
  ).toBe(`import
{
  alpha,
} from "example";
const value =
{
  nested:
  {
    enabled: true,
  },
  empty:
  {
  },
};
const
{
  nested,
} = value;
type Settings =
{
  enabled: boolean;
};
`);
});

test("defaults nested JSON object braces to the next line", async () => {
  expect(
    await format('{"outer":{"empty":{},"enabled":true}}', {
      parser: "json",
    }),
  ).toBe(`{
  "outer":
  {
    "empty":
    {
    },
    "enabled": true
  }
}
`);
});

test("defaults CSS rule braces to the next line", async () => {
  expect(
    await format(".alpha { color: red; } @media (width > 1px) { .beta {} }", {
      parser: "css",
    }),
  ).toBe(`.alpha
{
  color: red;
}
@media (width > 1px)
{
  .beta
  {
  }
}
`);
});

test("defaults GraphQL selection and object value braces to the next line", async () => {
  expect(
    await format(
      "query Example { viewer { settings(value: { enabled: true }) { id } } }",
      { parser: "graphql" },
    ),
  ).toBe(`query Example
{
  viewer
  {
    settings(
      value:
      {
        enabled: true
      }
    )
    {
      id
    }
  }
}
`);
});

test("defaults YAML flow mapping braces to the next line", async () => {
  expect(
    await format("settings: {enabled: true, nested: {value: 1}, empty: {}}", {
      parser: "yaml",
    }),
  ).toBe(`settings:
  {
    enabled: true,
    nested:
      {
        value: 1,
      },
    empty:
      {
      },
  }
`);
});

test("aligns empty braces and preserves syntax-sensitive return objects", async () => {
  expect(
    await format(
      "function empty() {} const value = {}; const result = call({ enabled: true }); function returns() { return { enabled: true }; }",
      { parser: "babel" },
    ),
  ).toBe(`function empty()
{
}
const value =
{
};
const result = call(
  {
    enabled: true,
  },
);
function returns()
{
  return {
    enabled: true,
  };
}
`);
});

test("covers JSON-stringify, SCSS, Less, GraphQL definitions, and Angular blocks", async () => {
  expect(
    await Promise.all([
      format('{"outer":{"empty":{}}}', { parser: "json-stringify" }),
      format(".alpha { font: { size: 1px; } }", { parser: "scss" }),
      format(".mixin() { color: red; }", { parser: "less" }),
      format("schema { query: Query } type Query { viewer: User }", {
        parser: "graphql",
      }),
      format("@if (ready) { <div></div> } @else { <span></span> }", {
        parser: "angular",
      }),
    ]),
  ).toStrictEqual([
    '{\n  "outer":\n  {\n    "empty":\n    {\n    }\n  }\n}\n',
    ".alpha\n{\n  font:\n  {\n    size: 1px;\n  }\n}\n",
    ".mixin()\n{\n  color: red;\n}\n",
    "schema\n{\n  query: Query\n}\ntype Query\n{\n  viewer: User\n}\n",
    "@if (ready)\n{\n  <div></div>\n} @else\n{\n  <span></span>\n}\n",
  ]);
});

test("same-line preserves inherited formatting across structural brace printers", async () => {
  const options = { braceStyle: "same-line" };
  expect(
    await Promise.all([
      format("const value = { enabled: true };", {
        ...options,
        parser: "babel",
      }),
      format('{"outer":{"enabled":true}}', {
        ...options,
        parser: "json",
      }),
      format(".alpha { color: red; }", { ...options, parser: "css" }),
      format("query Example { viewer { id } }", {
        ...options,
        parser: "graphql",
      }),
      format("settings: {enabled: true}", { ...options, parser: "yaml" }),
    ]),
  ).toStrictEqual([
    "const value = { enabled: true };\n",
    '{ "outer": { "enabled": true } }\n',
    ".alpha {\n  color: red;\n}\n",
    "query Example {\n  viewer {\n    id\n  }\n}\n",
    "settings: { enabled: true }\n",
  ]);
});

test("keeps a comment directly above a next-line object brace stable", async () => {
  const cases = [
    [
      "const g =\n  // c\n  { a: 1 };\nconst h =\n  /* c */\n  { a: 1 };\n",
      "babel",
      "const g =\n  // c\n  {\n    a: 1,\n  };\nconst h =\n  /* c */\n  {\n    a: 1,\n  };\n",
    ],
    [
      "type F =\n  // c\n  { a: 1 };\ntype M =\n  // c\n  { [K in X]: 1 };\n",
      "typescript",
      "type F =\n  // c\n  {\n    a: 1;\n  };\ntype M =\n  // c\n  {\n    [K in X]: 1;\n  };\n",
    ],
    // Matches oxfmt-next-line: a comment before a union that starts with an object breaks it one member per line.
    [
      "type C = /* multi\n * line */ { a: 1 } | null;\ntype D = /* c */ { a: 1 } | null;\ntype E =\n  // c\n  { a: 1 } | null;\n",
      "typescript",
      "type C =\n  | /* multi\n     * line */\n    {\n      a: 1;\n    }\n  | null;\ntype D =\n  | /* c */\n    {\n      a: 1;\n    }\n  | null;\ntype E =\n  // c\n  |\n    {\n      a: 1;\n    }\n  | null;\n",
    ],
  ];
  for (const [input, parser, expected] of cases) {
    const firstPass = await format(input, { parser });
    expect(firstPass).toBe(expected);
    expect(await format(firstPass, { parser })).toBe(firstPass);
  }
});

test("breaks after the operator when a block comment precedes a next-line object brace", async () => {
  const cases = [
    [
      "const x = /* c */ { a: 1 };\nx = /* c */ { a: 1 };\nconst o = { k: /* c */ { a: 1 } };\n",
      "babel",
      "const x =\n  /* c */\n  {\n    a: 1,\n  };\nx =\n  /* c */\n  {\n    a: 1,\n  };\nconst o =\n{\n  k:\n    /* c */\n    {\n      a: 1,\n    },\n};\n",
    ],
    [
      "type M1 = /* c */ { a: 1 };\n",
      "typescript",
      "type M1 =\n  /* c */\n  {\n    a: 1;\n  };\n",
    ],
  ];
  for (const [input, parser, expected] of cases) {
    const firstPass = await format(input, { parser });
    expect(firstPass).toBe(expected);
    expect(await format(firstPass, { parser })).toBe(firstPass);
  }
});
