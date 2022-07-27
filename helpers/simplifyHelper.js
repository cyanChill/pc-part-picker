/* Simplifies an inputted integer number (used for product stock value) */
exports.simplifyIntNum = (num) => {
  if (num < 1000) return Number.parseInt(num);
  if (num < 1000000) return `${Number.parseInt(num / 1000)}k`;
  if (num < 1000000000) return `${Number.parseInt(num / 1000000)} mil`;
  return num; // Number is too big
};

/* Simplifies an inputted float number (used for product price value) */
exports.simplifyFloatNum = (num) => {
  return Number.parseFloat(num).toFixed(2);
};
