export const cloneDeep = <T extends object>(item: T) =>
  JSON.parse(JSON.stringify(item));
