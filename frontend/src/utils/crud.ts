export default function getById<T extends { id?: string }>(collection: Array<T>, itemId: string): T {
  const foundItem = collection.find((item) => item.id === itemId);
  if (!foundItem) {
    throw Error(`Can't find item with id = ${itemId}`);
  }
  return foundItem;
}
