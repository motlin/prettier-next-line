import { format } from "../../src/index.js";

const javascriptInput =
  "function example(value) { if (value) { return true; } else { return false; } }";

test("defaults JavaScript block braces to the next line", async () => {
  expect(await format(javascriptInput, { parser: "babel" })).toBe(`function example(value)
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
