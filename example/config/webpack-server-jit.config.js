var path = require('path');
var webpack = require('webpack');
var ngtools = require('@ngtools/webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    stats: 'errors-only',
    clientLogLevel: 'error'
  },
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
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack',
        options: {
          tsConfigPath: "./src/tsconfig.json"
        }
      },
      {
        test: /\.(html|css)$/,
        use: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.ts' ],
    modules: [ path.join(__dirname, '../node_modules') ]
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

    new ngtools.AngularCompilerPlugin({
      entryModule: './src/app/app.module#AppModule',
      tsConfigPath: './src/tsconfig.json'
    }),

    new webpack.ContextReplacementPlugin(
      /@angular(\\|\/)core(\\|\/)/,
      path.join(__dirname, '../src')
    )
  ]
};
