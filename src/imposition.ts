// returns page numbers [top left, top right, bottom left, bottom right]
export function fourPageImposition(
  sheet: number,
  isFront: boolean,
  sheetsInSignature: number
) {
  const basePageNumber = Math.floor(sheet / sheetsInSignature) * sheetsInSignature * 8;
  const placeInSignature = sheet % sheetsInSignature;

  if (isFront) {
    // prettier-ignore
    return [
      sheetsInSignature * 8 - placeInSignature * 4 - 1,   placeInSignature * 4,
      sheetsInSignature * 8 - (placeInSignature + 1) * 4, placeInSignature * 4 + 3
    ].map(x => x + basePageNumber);
  } else {
    // prettier-ignore
    return [
      placeInSignature * 4 + 1, sheetsInSignature * 8 - placeInSignature * 4 - 2,
      placeInSignature * 4 + 2, sheetsInSignature * 8 - placeInSignature * 4 - 3 
    ].map(x => x + basePageNumber);
  }
}
