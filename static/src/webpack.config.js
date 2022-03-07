/* eslint-disable no-undef */
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '', dir);
}

module.exports = {
  // entry point of our application
  mode: 'production',
  entry: {
    editor: './editor.js',
    answerfieldsconfig: './answerfieldsconfig.js',
    component_helper: './component_helper.js',
    performancestats: './performancestats.js',
    task_browse: './task_browse.js',
    userprofile: './userprofile.js',
    wizard: './wizard.js',
    setting: './setting.js'
  },
  // where to place the compiled bundle
  output: {
    path: resolve('../js/gen'),
    publicPath: '/static/js/gen',
    filename: '[name].min.[hash].js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.html/,
        loader: 'html-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader:
          'file-loader?outputPath=../img/search/&publicPath=../img/search/'
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/account/profile.html',
      template: '../../templates/account/profile.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/answerfieldsconfig.html',
      template: '../../templates/projects/answerfieldsconfig.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/new_blogpost.html',
      template: '../../templates/projects/new_blogpost.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/admin/new_announcement.html',
      template: '../../templates/admin/new_announcement.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/tasks_browse.html',
      template: '../../templates/projects/tasks_browse.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/component_helper.html',
      template: '../../templates/projects/component_helper.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/performancestats.html',
      template: '../../templates/projects/performancestats.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/wizard.html',
      template: '../../templates/projects/wizard.webpack.ejs'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      filename: '../../../templates/projects/summary.html',
      template: '../../templates/projects/summary.webpack.ejs'
    }),
    new VueLoaderPlugin()
  ]
};
