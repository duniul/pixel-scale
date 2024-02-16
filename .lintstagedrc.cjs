const prettierFormat = 'prettier --write';
const biomeLintAndFormat = 'biome check --apply';

module.exports = {
  '*.{md,html,yaml,yml,css,scss}': [prettierFormat],
  '*.{ts,tsx,js,jsx,json}': [biomeLintAndFormat],
};
