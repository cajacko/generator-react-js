const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function () {
  return {
    entry: {
      main: './app/index.js',
    },
    devtool: 'source-map',
    output: {
      filename: '[chunkhash].[name].js',
      path: path.resolve(__dirname, 'build')
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),
      new WebpackCleanupPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['manifest'] // Specify the common bundle's name.
      }),
      new ManifestPlugin()
    ]
  };
};

// const webpack = require('webpack');
// const path = require('path');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
//
// module.exports = function(env) {
//     return {
//         entry: {
//             main: './app/index.js',
//             vendor: 'moment'
//         },
//         output: {
//             filename: '[name].[chunkhash].js',
//             path: path.resolve(__dirname, 'dist')
//         },
//         plugins: [
//             new webpack.optimize.CommonsChunkPlugin({
//                 names: ['vendor', 'manifest'],
//                 minChunks: function (module) {
//                    // this assumes your vendor imports exist in the node_modules directory
//                    return module.context && module.context.indexOf('node_modules') !== -1;
//                 }
//             }),
//             new CleanWebpackPlugin(['dist']),
//             new ManifestPlugin({
//               fileName: 'manifest.json'
//             }),
//             new ChunkManifestPlugin({
//               filename: "chunk-manifest.json",
//               manifestVariable: "webpackManifest"
//             })
//         ]
//     }
// };
