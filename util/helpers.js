const dig = (target, ...keys) => {
  let digged = target;
  for (const key of keys) {
    if (typeof digged === "undefined" || digged === null) {
      return undefined;
    }

    digged = digged[key];
  }
  return digged;
};

module.exports.dig = dig;
