# Maculate

Maculate is a thin fork of [Prettier](https://prettier.io) published under its
own name. It provides the formatter core used by the Maculate plugin family,
including [maculate-java](https://github.com/motlin/maculate-java).

## Installation

```bash
npm install --save-dev maculate
```

## Usage

Check formatting without changing files:

```bash
npx maculate --check .
```

Format files in place:

```bash
npx maculate --write .
```

Maculate retains Prettier's CLI, configuration, plugin API, and supported core
languages. Existing Prettier documentation therefore describes the inherited
behavior:

- [Configuration](https://prettier.io/docs/configuration)
- [Options](https://prettier.io/docs/options)
- [CLI](https://prettier.io/docs/cli)
- [Plugin API](https://prettier.io/docs/plugins)

## Java

Install Maculate Java and load it explicitly:

```bash
npm install --save-dev maculate maculate-java
npx maculate --check --plugin=maculate-java "**/*.java"
```

## Upstream

Maculate follows [prettier/prettier](https://github.com/prettier/prettier). The
fork keeps its changes focused on Maculate's package identity and formatter
behavior.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
