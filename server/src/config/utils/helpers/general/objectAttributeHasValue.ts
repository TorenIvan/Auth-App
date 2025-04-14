export const objectAttributeExistsAndHasValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objectArg: any,
  attributeName: string
): boolean => {
  let objectAttributeHasValue: boolean = false;

  if (hasDefinedAttribute(objectArg, attributeName) === true)
    objectAttributeHasValue = true;
  return objectAttributeHasValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasDefinedAttribute = (element: any, attr: string) => {
  if (
    typeof element === "object" &&
    element !== null &&
    // eslint-disable-next-line no-prototype-builtins
    element.hasOwnProperty(attr) &&
    element[attr] !== undefined
  )
    return true;
  return false;
};
