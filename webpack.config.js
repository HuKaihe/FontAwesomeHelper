const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

const extractLESS = new ExtractTextPlugin('bundle.css');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: extractLESS.extract(['css-loader', 'less-loader']),
            },
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        extractLESS,
        new Uglify(),
    ],
};
