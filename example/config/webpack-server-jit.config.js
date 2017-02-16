var path = require('path');
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false
  },
  entry: {
    app: [
      './src/polyfills.ts',
      './src/main.ts'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist'),
    publicPath: 'http://localhost:8080/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          'angular2-template-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader?tsconfig=src/tsconfig.json',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ["raw-loader", "sass-loader"]
      },
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [ '../src', path.join(__dirname, "../node_modules") ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),

    new CopyWebpackPlugin([{
      context: './src/assets',
      from: '**/*',
      to: '../dist/assets'
    }]),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(__dirname, '../')
    )
  ]
};
