import { printBraceSeparator } from "../../common/brace-style.js";
import { printKey } from "./key.js";
import { printDeclareToken } from "./miscellaneous.js";
import { printObject } from "./object.js";

function printFlowEnumBody(path, options, print) {
  const { node } = path;
  return [
    node.explicitType ? `of ${node.explicitType}` : "",
    printBraceSeparator(options),
    printObject(path, options, print),
  ];
}

function printLegacyFlowEnumBody(path, options, print) {
  const { node } = path;
  return [
    node.type === "EnumSymbolBody" || node.explicitType
      ? `of ${node.type
          .slice(
            // `Enum`
            4,
            // `Body`
            -4,
          )
          .toLowerCase()}`
      : "",
    printBraceSeparator(options),
    printObject(path, options, print),
  ];
}

/*
- `EnumBooleanMember`(flow)
- `EnumNumberMember`(flow)
- `EnumBigIntMember`(flow)
- `EnumStringMember`(flow)
- `EnumDefaultedMember`(flow)
- `TSEnumMember`(TypeScript)
*/
function printEnumMember(path, options, print) {
  const { node } = path;
  const isTsEnumMember = node.type === "TSEnumMember";

  const idDoc = isTsEnumMember
    ? printKey(path, options, print)
    : // Flow only allow identifier
      print("id");
  const initializerProperty = isTsEnumMember ? "initializer" : "init";
  if (!node[initializerProperty]) {
    return idDoc;
  }

  return [idDoc, " = ", print(initializerProperty)];
}

/*
- `DeclareEnum`(flow)
- `EnumDeclaration`(flow)
- `TSEnumDeclaration`(TypeScript)
*/
function printEnumDeclaration(path, options, print) {
  const { node } = path;
  const isTypeScriptEnum = node.type === "TSEnumDeclaration";
  const hasFlowType =
    node.body.explicitType || node.body.type === "EnumSymbolBody";
  return [
    printDeclareToken(path),
    node.const ? "const " : "",
    "enum ",
    print("id"),
    isTypeScriptEnum ? printBraceSeparator(options) : hasFlowType ? " " : "",
    print("body"),
  ];
}

export {
  printEnumDeclaration,
  printEnumMember,
  printFlowEnumBody,
  printLegacyFlowEnumBody,
};
