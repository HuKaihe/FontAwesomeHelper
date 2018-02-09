const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLESS = new ExtractTextPlugin('bundle.css');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
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
    ],
};
