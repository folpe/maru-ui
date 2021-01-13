const path = require('path')
const { merge } = require('webpack-merge')

const parts = require('./webpack.config.parts')

const root = path.resolve(__dirname, '..')

const CORE_CONFIG = merge([
  {
    entry: {
      main: path.resolve(root, 'src'),
    },
    output: {
      path: path.resolve(root, 'dist'),
      filename: '[name].js',
      publicPath: '/',
    },
  },
  parts.friendlyErrors(),
  parts.babelize({ include: path.resolve(root, 'src') }),
  parts.lintJS(),
  parts.loadFonts(),
  parts.loadImages({ include: path.resolve(root, 'src') }),
  parts.copyStatic({
    from: path.resolve(root, 'static'),
    to: path.resolve(root, 'dist'),
  }),
  parts.generateSourceMaps('source-map'),
])

const productionConfig = () =>
  merge([
    {
      mode: 'production',
      // Cette nouvelle série d’options de Webpack 4 remplace pas mal d’anciennes manips,
      // notamment tout ce qui touche à `CommonsChunkPlugin`.
      optimization: {
        // Extraction à part de la *runtime* Webpack
        runtimeChunk: true,
        splitChunks: {
          // Ensure all CSS are put into a single file by MiniCSSExtractPlugin
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
          // Auto-splitting intelligent de tous les chunks (initiaux et asynchrones)
          // (par défaut, ça ne fait que les asynchrones).
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

console.log(CORE_CONFIG)

module.exports = productionConfig()
