# Prettier Next Line

Prettier Next Line is a thin fork of
[Prettier](https://github.com/prettier/prettier) with configurable opening-brace
placement for JavaScript and TypeScript. It defaults to Allman-style,
next-line braces.

## Installation

Install it directly:

```bash
npm install --save-dev prettier-next-line
npx prettier-next-line --write .
```

Tools that require a package named `prettier`, including Spotless, can install
it through an npm alias:

```bash
npm install --save-dev prettier@npm:prettier-next-line
npx prettier-next-line --write .
```

## Brace style

Next-line braces are the default:

```json
{
  "braceStyle": "next-line"
}
```

Use Prettier's inherited K&R placement when needed:

```json
{
  "braceStyle": "same-line"
}
```

The option applies to JavaScript and TypeScript code blocks and declarations.
It does not change object literals, imports, JSX, JSON, CSS, or other
non-block braces.

## Java

Use [prettier-java-next-line](https://github.com/motlin/prettier-java-next-line)
for Java:

```bash
npm install --save-dev \
  prettier@npm:prettier-next-line \
  prettier-java-next-line
npx prettier-next-line --write --plugin=prettier-java-next-line "**/*.java"
```

## Upstream

Prettier Next Line tracks [prettier/prettier](https://github.com/prettier/prettier)
and keeps fork-specific behavior focused on brace placement.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
