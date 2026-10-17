export const isNumber = (val: unknown) => {
  const numericVal = Number(val);
  return !isNaN(numericVal);
};
