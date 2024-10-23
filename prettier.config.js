const styleguide = require('@vercel/style-guide/prettier')

module.exports = {
  ...styleguide,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
  printWidth: 120, // longer lines!
  semi: false, // less semi-colons!
}
