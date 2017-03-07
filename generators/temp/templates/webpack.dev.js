const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function webpackConfig() {
  return {
    entry: {
      main: './src/index.js',
    },
    // Enable source map (Could use a quicker system, for dev,
    // if the build gets big)
    devtool: 'source-map',
    // Out put with cache buster names
    output: {
      filename: '[chunkhash].[name].js',
      path: path.resolve(__dirname, 'build')
    },
    // Babel is needed to get rid of flow type
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
      ],
    },
    plugins: [
      // Bundle analyzer lets you observe what each webpack budle is made up of
      // Generates a report.html file in the output folder
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),
      // Remove old budles before creating new ones
      new WebpackCleanupPlugin(),
      // Split all node modules into seperate bundle
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
      }),
      // CSplit out the manifest
      new webpack.optimize.CommonsChunkPlugin({
        names: ['manifest'] // Specify the common bundle's name.
      }),
      // Capture the manifest in a json file so we can easily import in our html
      new ManifestPlugin()
    ],
    // Create import alias' so we don't have to have tedious relative paths
    resolve: {
      alias: {
        Src: path.resolve(__dirname, 'src/')
      }
    }
  };
};
