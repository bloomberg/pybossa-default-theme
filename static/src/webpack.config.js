// webpack.config.js
const htmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '', dir)
}

module.exports = {
  // entry point of our application
  entry: './editor.js',
  // where to place the compiled bundle
  output: {
    path: resolve('../js/gen'),
    publicPath: '/static/js/gen',
    filename: 'editor.min.js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },

  module: {
    rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          loader: 'file-loader?outputPath=../img/search/&publicPath=../img/search/'
        },
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
        new htmlWebpackPlugin({
          inject: false,
          hash: true,
          filename: '../../templates/projects/new_blogpost.html',
          template: '../../templates/projects/new_blogpost.webpack'
        }),
        new htmlWebpackPlugin({
          inject: false,
          hash: true,
          filename: '../../templates/admin/new_announcement.html',
          template: '../../templates/admin/new_announcement.webpack'
        }),
        new VueLoaderPlugin()
        
        
    ]
}