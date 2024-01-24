export const isLightHexColor = (hex) => {
  if (!hex || typeof hex !== 'string') return undefined;
  const hexArr = hex.toLowerCase().split('#').pop().split('');
  const chars =
    hexArr.length === 3
      ? [hexArr[0], hexArr[2]]
      : [hexArr[0], hexArr[2], hexArr[4]];
  return chars.every((char) => ['f', 'e', 'd'].includes(char));
};
