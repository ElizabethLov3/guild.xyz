import { AbiFunction, AbiParameter } from "viem"

const getType = (param: AbiParameter): string => {
  if (
    (param.type === "tuple" || param.type === "tuple[]") &&
    "components" in param
  ) {
    return `(${param.components.map((component) => getType(component)).join(", ")})${param.type === "tuple[]" ? "[]" : ""}`
  }

  return param.type
}

export const abiItemToFunctionSignature = (
  item: AbiFunction,
  mode: "PARAM_TYPES" | "PARAM_NAMES" = "PARAM_TYPES"
) => {
  if (mode === "PARAM_NAMES")
    return `${item.name}(${item.inputs.map((input) => `${input.name ? `${input.name} ` : ""}${getType(input)}`).join(", ")})`

  return `${item.name}(${item.inputs.map((input) => getType(input)).join(", ")})`
}
