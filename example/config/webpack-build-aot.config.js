var path = require('path');
var webpack = require('webpack');
var ngtools = require('@ngtools/webpack');

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
    sourceMapFilename: '[name].css.map',
    path: path.join(__dirname, '../dist'),
    publicPath: 'https://zefoy.github.io/ngx-perfect-scrollbar/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['angular2-template-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loaders: ['@ngtools/webpack']
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [ '../src', path.join(__dirname, '../node_modules') ]
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

    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),

    new ngtools.AotPlugin({
      tsConfigPath: path.join(__dirname, '../src/tsconfig.json'),
      entryModule: path.join(__dirname, '../src/app/app.module#AppModule')
    }),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.join(__dirname, '../src')
    )
  ]
};
