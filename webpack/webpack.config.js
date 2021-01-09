const path = require('path');

const root = path.resolve(__dirname, ..)

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(root, 'dist'),
    filename: '[name].js'
  }
};
