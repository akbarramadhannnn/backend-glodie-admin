exports.ReplaceToSlug = (str) => {
  return str.replace(/\s+/g, "-").toLowerCase();
};

exports.ReplaceToLowerCaseNoSpace = (str) => {
  return str.replace(/[^\w-]+/g, "").toLowerCase();
};

exports.ReplaceToStartUpperCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
