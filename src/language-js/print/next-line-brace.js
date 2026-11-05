import { hardline } from "../../document/index.js";
import hasNewline from "../../utilities/has-newline.js";
import { locEnd, locStart } from "../location/index.js";
import { isBlockComment } from "../utilities/comment-types.js";
import { CommentCheckFlags, getComments } from "../utilities/comments.js";
import { isUnionType } from "../utilities/node-types.js";
import { shouldHugUnionType } from "../utilities/union-type-print.js";

/**
 * The line break a next-line brace prints before `{`.
 * A leading comment printed right before the brace already ends its line,
 * so another break would leave a blank line that grows on every format pass.
 * The comment may belong to the node or to an ancestor starting at the same place (a union's first member).
 */
function printNextLineBraceBreak(path, options) {
  const start = locStart(path.node);
  for (let depth = 0; ; depth++) {
    const node = path.getNode(depth);
    // A union laid out one member per line prints its comments before the first `|`, not right before `{`.
    if (
      !node ||
      locStart(node) !== start ||
      (isUnionType(node) && !shouldHugUnionType(node, options))
    ) {
      return hardline;
    }
    const lastLeadingComment = getComments(node, CommentCheckFlags.Leading).at(
      -1,
    );
    if (lastLeadingComment) {
      const endsLine =
        !isBlockComment(lastLeadingComment) ||
        hasNewline(options.originalText, locEnd(lastLeadingComment));
      return endsLine ? "" : hardline;
    }
  }
}

export { printNextLineBraceBreak };
