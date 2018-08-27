const syntax = require('postcss-scss');

module.exports = {
  plugins: [
    require('postcss-nested')(),
    require('postcss-flexbugs-fixes')(),
    require('postcss-discard-duplicates')(),
    require('postcss-discard-empty')(),
    require('postcss-ordered-values')(),
    require("postcss-selector-not")(),
    require("postcss-font-family-system-ui")(),
    require('postcss-combine-duplicated-selectors')(),
    require('postcss-color-hex-alpha')(),
    require('stylefmt')()
  ],
  options: {
    parser: syntax,
    map: false,
    syntax: syntax
  }
};
