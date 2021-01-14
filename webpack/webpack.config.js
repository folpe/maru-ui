const path = require('path')
const { merge } = require('webpack-merge')

const parts = require('./webpack.config.parts')

const root = path.resolve(__dirname, '..')

const CORE_CONFIG = merge([
  {
    entry: {
      main: path.resolve(root, 'src/index.js'),
    },
    output: {
      crossOriginLoading: 'anonymous',
      devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
      path: path.resolve(root, 'dist'),
      filename: 'main.js',
      libraryTarget: 'commonjs2',
      publicPath: '/dist/',
    },
  },
  parts.friendlyErrors(),
  parts.babelize({ include: path.resolve(root, 'src') }),
  parts.lintJS(),
  parts.loadFonts(),
  parts.loadImages({ include: path.resolve(root, 'src') }),
])

const productionConfig = () =>
  merge([
    {
      mode: 'production',
      optimization: {
        // runtimeChunk: true,
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
          chunks: 'all',
        },
      },
      output: { filename: '[name].[chunkhash:8].js' },
    },
    CORE_CONFIG,
    parts.cleanDist(),
    parts.extractCSS(),
    parts.extractSass({ include: path.resolve(root, 'src') }),
    parts.generateSourceMaps('source-map'),
    parts.minifyAll(),
    parts.optimizeImages(),
  ])

module.exports = productionConfig()
