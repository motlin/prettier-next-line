import { hardline } from "../../document/index.js";

function isNextLineBraceStyle(options) {
  return options.braceStyle === "next-line";
}

function printBraceSeparator(options) {
  return isNextLineBraceStyle(options) ? hardline : " ";
}

export { isNextLineBraceStyle, printBraceSeparator };
