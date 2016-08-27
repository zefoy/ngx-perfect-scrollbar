var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    'main': './src/main.ts',
    'polyfills': './src/polyfills.ts'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    publicPath: 'http://localhost:8080/',
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      {
    	  test: /\.ts$/,
    	  loaders: [
					'awesome-typescript-loader',
					'angular2-template-loader'
				]
    	},
      {
        test: /\.(html|css)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['main', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'index.html'
    }),

    new CopyWebpackPlugin([{
      context: './public',
      from: '**/*',
      to: './dist'
    }])
  ]
};
