import { isNextLineBraceStyle } from "../../common/brace-style.js";
import hasNewline from "../../utilities/has-newline.js";
import { locStart } from "../location/index.js";
import { isBlockComment } from "./comment-types.js";
import { CommentCheckFlags, hasComment } from "./comments.js";
import { createTypeCheckFunction } from "./create-type-check-function.js";
import { isIntersectionType, isTupleType, isUnionType } from "./node-types.js";

const isVoidType = createTypeCheckFunction([
  "VoidTypeAnnotation",
  "TSVoidKeyword",
  "NullLiteralTypeAnnotation",
  "TSNullKeyword",
]);

const isObjectLikeType = createTypeCheckFunction([
  "ObjectTypeAnnotation",
  "TSTypeLiteral",
  // This is a bit aggressive but captures Array<{x}>
  "GenericTypeAnnotation",
  "TSTypeReference",
]);

function isMultipleTupleTypeElement(path) {
  return (
    path.key === "elementTypes" &&
    isTupleType(path.parent) &&
    path.parent.elementTypes.length > 1
  );
}

function shouldHugUnionType(node, options) {
  const { types } = node;
  if (types.some((node) => hasComment(node))) {
    return false;
  }

  // Next-line braces always break the hugged object, so the comment ends up on its own line
  // and the next pass would switch to one member per line; take that layout on the first pass.
  if (
    options &&
    isNextLineBraceStyle(options) &&
    types.length > 1 &&
    hasComment(
      node,
      CommentCheckFlags.Leading,
      (comment) =>
        hasNewline(options.originalText, locStart(comment), {
          backwards: true,
        }) ||
        (isBlockComment(comment) && comment.value.includes("\n")),
    )
  ) {
    return false;
  }

  const objectType = types.find((node) => isObjectLikeType(node));
  if (!objectType) {
    return false;
  }

  return types.every((node) => node === objectType || isVoidType(node));
}

function shouldUnionTypePrintOwnComments(path, options) {
  const { key, node, parent } = path;
  if (
    shouldHugUnionType(node, options) ||
    // If it's `types` of union type, parent will print comment for it
    (key === "types" && isUnionType(parent)) ||
    // Inside intersection type let the comment print outside of parentheses
    (key === "types" && isIntersectionType(parent)) ||
    isMultipleTupleTypeElement(path)
  ) {
    return false;
  }

  return true;
}

export {
  isMultipleTupleTypeElement,
  shouldHugUnionType,
  shouldUnionTypePrintOwnComments,
};
