export default function replaceAll(value: string, removables: string[], target: string) {
  let result = value;

  for (const item of removables) {
    result = result.replace(new RegExp(item, "g"), target);
  }

  return result;
}
