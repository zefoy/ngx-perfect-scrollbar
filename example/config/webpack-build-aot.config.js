var path = require('path');
var webpack = require('webpack');
var ngtools = require('@ngtools/webpack');

var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  stats: 'errors-only',
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
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: '@ngtools/webpack'
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
    new UglifyJSPlugin({
      sourceMap: true
    }),

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
