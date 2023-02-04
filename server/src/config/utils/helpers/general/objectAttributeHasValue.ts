export const objectAttributeExistsAndHasValue = (
  objectArg: any,
  attributeName: string
): boolean => {
  let objectAttributeHasValue: boolean = false;

  if (hasDefinedAttribute(objectArg, attributeName) === true)
    objectAttributeHasValue = true;
  return objectAttributeHasValue;
};

const hasDefinedAttribute = (element: any, attr: string) => {
  if (
    typeof element === "object" &&
    element !== null &&
    element.hasOwnProperty(attr) &&
    element[attr] !== undefined
  )
    return true;
  return false;
};
