const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

console.log(` *** Webpack is running in ${chalk.green(process.env.NODE_ENV)} environment`);

let imageLoaders = [
    {
        loader: 'file-loader',
        options: {
            name: '[name].[ext]',
            outputPath: 'img/'
        }
    }
];

if (process.env.NODE_ENV === 'production') {
    imageLoaders.push({
        loader: 'image-webpack-loader',
        options: {
            mozjpeg: {
                progressive: true,
                quality: 50
            }
        }
    });
}

/** Define plugin to extract sass sources into single css file. **/
const extractStyles = new extractTextPlugin({
    filename: 'styles/styles.[contenthash].css'
});

const config = {
    entry: {
        bundle: './app/index.js'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].[chunkhash].js'
    },

    /** Enable source maps. **/
    devtool: 'source-map',

    /** Specify devServer directory. **/
    devServer: {
        contentBase: './build'
    },

    module: {
        /** Define an array of webpack loaders. **/
        rules: [
            /** Handle js files **/
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },

            /** Handle sass/scss files **/
            {
                test: /\.(sass|scss)$/,
                use: extractStyles.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer({
                                        browsers: ['ie >= 8', 'last 4 version']
                                    })
                                ],
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },

            /** Handle html files **/
            {
                test: /\.html$/,
                use: 'html-loader'
            },

            /** Handle image files **/
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                use: imageLoaders
            }
        ]
    },
    plugins: [
        /** Define window scope variable NODE_ENV. And assign corresponding value to it. **/
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new htmlWebpackPlugin({ template: 'app/index.html' }),

        extractStyles,

        /** Copy icons files to the build directory **/
        new copyWebpackPlugin([{ from: path.resolve(__dirname, 'app', 'img', 'icons'), to: 'img/icons' }])
    ]
};

module.exports = config;
