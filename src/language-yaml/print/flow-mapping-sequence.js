import { isNextLineBraceStyle } from "../../common/brace-style.js";
import {
  hardline,
  ifBreak,
  join,
  line,
  softline,
} from "../../document/index.js";
import { hasEndComments, isEmptyNode } from "../utilities.js";
import { alignWithSpaces, printNextEmptyLine } from "./misc.js";

function printFlowMapping(path, options, print) {
  const { node } = path;
  const isMapping = node.type === "flowMapping";
  const useNextLineBraces = isMapping && isNextLineBraceStyle(options);
  const openMarker = isMapping ? "{" : "[";
  const closeMarker = isMapping ? "}" : "]";

  if (useNextLineBraces && node.children.length === 0) {
    return [openMarker, hardline, closeMarker];
  }

  /** @type {typeof hardline | typeof softline | typeof line} */
  let bracketSpacing = softline;
  if (useNextLineBraces) {
    bracketSpacing = hardline;
  } else if (isMapping && node.children.length > 0 && options.bracketSpacing) {
    bracketSpacing = line;
  }
  const lastItem = node.children.at(-1);
  const isLastItemEmptyMappingItem =
    lastItem?.type === "flowMappingItem" &&
    isEmptyNode(lastItem.key) &&
    isEmptyNode(lastItem.value);

  return [
    openMarker,
    alignWithSpaces(options.tabWidth, [
      bracketSpacing,
      printChildren(path, options, print),
      node.children.length === 0 || options.trailingComma === "none"
        ? ""
        : ifBreak(","),
      hasEndComments(node)
        ? [hardline, join(hardline, path.map(print, "endComments"))]
        : "",
    ]),
    isLastItemEmptyMappingItem ? "" : bracketSpacing,
    closeMarker,
  ];
}

function printChildren(path, options, print) {
  return path.map(
    ({ isLast, node, next }) => [
      print(),
      isLast
        ? ""
        : [
            ",",
            line,
            node.position.start.line !== next.position.start.line
              ? printNextEmptyLine(path, options.originalText)
              : "",
          ],
    ],
    "children",
  );
}

export {
  printFlowMapping,
  // Alias
  printFlowMapping as printFlowSequence,
};
