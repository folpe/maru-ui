const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.html = (options) => {
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  return { plugins: [new HtmlWebpackPlugin(options)] }
}

exports.babelize = ({ include, exclude = /node_modules/ } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include,
          exclude,
          use: [
            {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-env'] },
            },
          ],
        },
      ],
    },
  }
}
exports.friendlyErrors = ({
  icon,
  notify = false,
  title = 'Webpack Build Error',
} = {}) => {
  let opts = {}
  if (notify) {
    const notifier = require('node-notifier')
    opts = {
      onErrors(severity, errors) {
        if (severity !== 'error') {
          return
        }

        const error = errors[0]
        notifier.notify({
          title,
          message: `${severity} : ${error.name}`,
          subtitle: error.file || '',
          icon,
        })
      },
    }
  }

  return {
    plugins: [new FriendlyErrorsWebpackPlugin(opts)],
  }
}

exports.errorOverlay = () => {
  const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
  const path = require('path')

  return {
    // eval-based source maps can't work with this overlay
    devtool: 'cheap-module-source-map',
    // We need absolute filenames for proper click-to-open-editor behavior
    output: {
      devtoolModuleFilenameTemplate(info) {
        return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
      },
    },
    plugins: [new ErrorOverlayPlugin()],
  }
}

exports.copyStatic = ({ from, to }) => ({
  plugins: [
    // Copie / met à dispo en mémoire des fichiers statiques vers un
    // chemin en sortie.  On aurait pu les coller direct dans `public/`,
    // mais alors Webpack ne les aurait pas «détectés», et d’autres
    // plugins ne les auraient pas pris en compte (tels que la gestion
    // de l’*offline*, par exemple).
    new CopyWebpackPlugin({ patterns: [{ from, to }] }),
  ],
})

// Source Maps
// -----------
//
// Webpack nous propose une bonne demi-douzaine de types de
// [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
// pour nos fichiers transpilés et le bundle final, mais seules
// certaines garantissent le bon fonctionnement des points
// d’arrêt dans Chrome.  On utilise ici celle qui, parmi les «bonnes»,
// est créée le plus vite par Webpack.
// devtool: '#inline-source-map'

exports.generateSourceMaps = (type = 'cheap-module-source-map') => ({
  devtool: type,
})

// Minifie les JS (auto de base) **et les CSS**.  Définir l’option écrase sa
// valeur par défaut, donc on la restaure côté Terser.
exports.minifyAll = () => {
  const TerserPlugin = require('terser-webpack-plugin')
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
  }
}
// Passe les images (inline ou non) par imagemin, lequel délègue aux optimiseurs
// de l’état de l’art par type d’image : mozjpeg pour les JPEG, pngquant pour les PNG
// (on désactive optipng, moins performant), gifsicle pour les GIF, et svgo pour les SVG.
// On cale par défaut le facteur de qualité des JPEG à 75, amplement suffisant pour 99,9% des cas.
//
// Si vous spritez les images, assurez-vous de faire passer cette optimisation *après* le spriting,
// pas avant (donc *avant* en termes de pipeline de chargeurs…).
exports.optimizeImages = (options = {}) => {
  options = {
    optipng: { enabled: false },
    ...options,
    mozjpeg: { quality: 75, ...(options.mozjpeg || {}) },
  }
  return {
    module: {
      rules: [
        {
          test: /\.(?:jpe?g|png|gif|svg)$/,
          use: [{ loader: 'image-webpack-loader', options }],
        },
      ],
    },
  }
}

// ESLint
// ------
//
// Permet d’assurer le *linting* pendant le build, indépendamment de son recours
// dans l’éditeur / EDI ou en hook de pre-commit Git.  Exclue `node_modules` par
// défaut.  La configuration est supposée externe (`.eslintrc.json` ou clé
// `eslintConfig` dans `package.json`).
exports.lintJS = ({ include, exclude = /node_modules/ } = {}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        use: ['eslint-loader'],
      },
    ],
  },
})

// Purge le dossier de build (`output.path`), ce qui est notamment utile quand les noms de fichiers
// changent parfois d’un build à l’autre, par exemple en raison de leur hash.
exports.cleanDist = (paths, options) => {
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  return { plugins: [new CleanWebpackPlugin(paths, options)] }
}

// Chargeurs de syntaxe
// --------------------
exports.loadFonts = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(?:woff2?|eot|ttf|otf)$/,
        include,
        exclude,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, name: '[sha256:hash:16].[ext]' },
          },
        ],
      },
    ],
  },
})

exports.loadImages = ({ include, exclude, ieSafeSVGs = true } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(?:jpe?g|png|gif)$/,
        include,
        exclude,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, name: '[sha256:hash:16].[ext]' },
          },
        ],
      },
      {
        test: /\.svg$/,
        include,
        exclude,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              iesafe: ieSafeSVGs,
              limit: 10000,
              name: '[sha256:hash:16].[ext]',
              stripdeclarations: true,
            },
          },
        ],
      },
    ],
  },
})

exports.extractCSS = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'css', include, exclude, modules })

exports.loadCSS = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'css', include, exclude, modules })

exports.extractSass = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'scss', include, exclude, modules, altLang: 'sass' })

exports.loadSass = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'scss', include, exclude, modules, altLang: 'sass' })

// Construit une pipeline de chargeurs CSS, avec ou sans `style-loader` en fin de chaîne (début de tableau, donc),
// assurant notamment PostCSS avec css-next mais aussi, en début de pipeline (fin de tableau), un éventuel
// transpileur si `altLang` est fourni (ex. `sass`, `stylus`, `less`).  Cœur de génération des règles pour les
// extracteurs (prod) et injecteurs (dev) de style.
//
// L’option `modules`, si elle est juste booléenne, se transforme en une série d’options fines pour de meilleures
// pratiques : export *camel-case only* et construction plus « débogable » des noms de classes dynamiques.
function buildCSSRule({
  ext,
  altLang = null,
  include,
  exclude,
  modules = false,
  useStyle = false,
}) {
  const cssOptions = { importLoaders: 1, sourceMap: true }
  if (modules === true) {
    modules = {
      camelCase: 'only',
      localIdentName: '_[name]-[local]-[hash:base64:4]',
      modules: true,
    }
  }
  if (modules) {
    Object.assign(cssOptions, modules)
  }

  const result = {
    test: new RegExp(`\\.${ext}$`),
    include,
    exclude,
    use: [
      { loader: 'css-loader', options: cssOptions },
      {
        loader: 'postcss-loader',
        options: {
          plugins: (loader) => [require('postcss-cssnext')()],
          sourceMap: true,
        },
      },
    ],
  }

  if (altLang) {
    result.use.push({
      loader: `${altLang}-loader`,
      options: { sourceMap: true },
    })
  }

  if (useStyle) {
    result.use.unshift('style-loader')
  }

  return result
}

// Afin de ne pas multiplier les plugins d’extraction, on en fait un par option
// (optionnelle d’ailleurs) `name`, et on maintient une map.  Seuls les nouveaux
// noms entraînent un ajout dans `plugins`.
const cssPlugins = new Map()

// `buildCSSRule(…)`.
function extractStyling({ ext, include, exclude, modules, name, altLang }) {
  const cssPluginExisted = cssPlugins.has(name)
  if (!cssPluginExisted) {
    cssPlugins.set(
      name,
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
    )
  }
  const cssPlugin = cssPlugins.get(name)

  const { test, use } = buildCSSRule({ ext, modules, altLang })

  return {
    plugins: cssPluginExisted ? [] : [cssPlugin],
    module: {
      rules: [
        {
          test,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader, ...use],
        },
      ],
    },
  }
}

// Construction générique d’une pipeline d’injection CSS.  Se repose en interne sur
// `buildCSSRule(…)`.
function loadStyling({ ext, include, exclude, modules, altLang }) {
  return {
    module: {
      rules: [
        buildCSSRule({
          ext,
          altLang,
          include,
          exclude,
          modules,
          useStyle: true,
        }),
      ],
    },
  }
}
