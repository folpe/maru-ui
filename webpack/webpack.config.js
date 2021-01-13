const path = require('path')
const { merge } = require('webpack-merge')

const parts = require('./webpack.config.parts')

console.log(parts)

const root = path.resolve(__dirname, '..')

const CORE_CONFIG = merge([
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(root, 'dist'),
      filename: '[name].js',
    },
  },
  parts.loadSass(),
])

module.exports = CORE_CONFIG
