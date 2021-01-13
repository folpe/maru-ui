const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Chargeurs de syntaxe
// --------------------
exports.extractCSS = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'css', include, exclude, modules })

exports.loadCSS = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'css', include, exclude, modules })

exports.extractSass = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'sass', include, exclude, modules, altLang: 'sass' })

exports.loadSass = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'sass', include, exclude, modules, altLang: 'sass' })

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
