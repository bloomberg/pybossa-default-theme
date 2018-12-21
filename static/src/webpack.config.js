// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '', dir)
}

module.exports = {
    // entry point of our application
    mode: 'production',
    entry: {
        editor: './editor.js',
        task_browse: './task_browse.js'
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
            'vue$': 'vue/dist/vue.esm.js'
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
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader?outputPath=../img/search/&publicPath=../img/search/'
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
            filename: '../../../templates/projects/componentBuilder.html',
            template: '../../templates/projects/componentBuilder.webpack.ejs'
        }),
        new VueLoaderPlugin()
    ]
}
