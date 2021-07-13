export default function removeTagsHTML(value: string) {
  let result = value;
  const tagInit = "<";
  const tagFinish = ">";

  let hasTag = result.includes(tagInit);
  while (hasTag) {
    let removedTag = "";
    const initIndex = result.indexOf(tagInit);
    const finishIndex = result.indexOf(tagFinish) + 1;

    if (initIndex === 0) {
      // Remove initial tag
      removedTag = result.substring(initIndex, finishIndex);
      result = result.substring(finishIndex, result.length);
    } else {
      // Remove tags in the middle
      removedTag = result.substring(initIndex, finishIndex);
      const resultInit = result.substring(0, initIndex);
      const resultFinish = result.substring(finishIndex, result.length);
      result = resultInit + resultFinish;
    }
    hasTag = result.includes(tagInit);
  }

  return result;
}
