export function generateEventMovementArray(
  array: string[],
  itemId: string,
  targetIndex: number
): string[] {
  const outArray = [...array];
  const currentIndex = outArray.indexOf(itemId);

  if (currentIndex !== targetIndex) {
    outArray.splice(currentIndex, 1);
    outArray.splice(targetIndex, 0, itemId);
  }

  return outArray;
}
