export enum TitleHeights {
  oneRow = 32,
  twoRows = 64,
  threeRows = 96,
  fourRows = 128
}

export const possibleDescHeight = {
  [TitleHeights.oneRow]: 'tree-row',
  [TitleHeights.twoRows]: 'two-row',
  [TitleHeights.threeRows]: 'one-row',
  [TitleHeights.fourRows]: 'hide'
};
