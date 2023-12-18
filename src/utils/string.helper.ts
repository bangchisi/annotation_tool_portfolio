export function formatStringForTable(str: string) {
  // If the string is undefined, return an empty string
  if (
    !str ||
    str === undefined ||
    str === null ||
    str === '' ||
    str.toLocaleLowerCase() === 'null' ||
    str.toLocaleLowerCase() === 'undefined'
  ) {
    return '';
  }

  // If the string is a path, return the original string
  const pathRegex = /.+\..+/;
  if (pathRegex.test(str)) {
    return str;
  }

  // Otherwise, perform the formatting
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Insert space before each capital letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}
