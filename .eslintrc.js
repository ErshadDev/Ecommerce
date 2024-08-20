module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: "airbnb-base",
  rules: {
    "import/extensions": ["off"],
    "linebreak-style": ["error", "windows"],
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-return-assign": 0,
    quotes: ["error", "double"],
    camelcase: 0,
  },
};
