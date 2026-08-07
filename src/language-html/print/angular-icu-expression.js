import {
  isNextLineBraceStyle,
  printBraceSeparator,
} from "../../common/brace-style.js";
import {
  group,
  hardline,
  indent,
  join,
  line,
  softline,
} from "../../document/index.js";
import { printClosingTagEnd, printOpeningTagStart } from "./tag.js";

/*
  <span i18n>
    Updated {minutes, plural,
      =0 {just now}
      =1 {one minute ago}
      other {{{minutes}} minutes ago}
    }
  </span>
*/

function printAngularIcuExpression(path, options, print) {
  const { node } = path;
  return [
    printOpeningTagStart(node, options),
    group([
      node.switchValue.trim(),
      ", ",
      node.type,
      node.cases.length > 0
        ? [",", indent([line, join(line, path.map(print, "cases"))])]
        : "",
      softline,
    ]),
    printClosingTagEnd(node, options),
  ];
}

function printAngularIcuCase(path, options, print) {
  const { node } = path;

  return [
    node.value,
    printBraceSeparator(options),
    "{",
    group([
      indent([
        isNextLineBraceStyle(options) ? hardline : softline,
        path.map(({ node, isLast }) => {
          const parts = [print()];

          if (node.kind === "text") {
            if (node.hasLeadingSpaces) {
              parts.unshift(line);
            }

            if (node.hasTrailingSpaces && !isLast) {
              parts.push(line);
            }
          }

          return parts;
        }, "expression"),
      ]),
      isNextLineBraceStyle(options) ? hardline : softline,
    ]),
    "}",
  ];
}

export { printAngularIcuCase, printAngularIcuExpression };
