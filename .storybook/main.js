const { merge } = require('webpack-merge')

const { loadSass } = require('../webpack/webpack.config.parts')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => merge(config, loadSass()),
}
