var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.ts',
  output: {
    path: './lib',
    filename: 'index.js',
    library: 'angular2-perfect-scrollbar',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js', '.ts']
  },
	externals: [
		"@angular/common",
    "@angular/compiler",
    "@angular/core",
    "@angular/forms",
    "@angular/http"
	]
};
