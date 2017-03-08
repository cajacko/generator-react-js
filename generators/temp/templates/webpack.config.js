const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = (env = {}) => {
  let isProduction;

  if (env.production) {
    isProduction = true;
  } else {
    isProduction = false;
  }

  return {
    entry: {
      main: './src/index.js',
    },

    output: {
      // Out put with cache buster names
      filename: '[chunkhash].[name].js',

      // Change build path for production and dev, makes it more obvious when
      // production build needs to happen
      path: (() => {
        if (isProduction) {
          return path.resolve(__dirname, 'build/production');
        }

        return path.resolve(__dirname, 'build/development');
      })()
    },

    // Enables sourcemaps
    devtool: (() => {
      if (isProduction) {
        return 'source-map';
      }

      return 'cheap-module-eval-source-map';
    })(),

    // Babel is needed to get rid of flow type annotations
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
        minChunks: (module) => {
          if (!module.context) {
            return false;
          }

          if (module.context.indexOf('node_modules') !== -1) {
            return true;
          }

          return false;
        }
      }),

      // Split out the manifest
      new webpack.optimize.CommonsChunkPlugin({
        names: ['manifest'] // Specify the common bundle's name.
      }),

      // Capture the manifest in a json file
      // This outputs a json file with each easy bundle name mapped to its hash
      // name. Then our templating engine can require the correct file
      new ManifestPlugin()
    ],

    // Create import alias' so we don't have to have tedious relative paths
    // Now our inport/require statements can use require('Src/Folder/File');
    resolve: {
      alias: {
        Src: path.resolve(__dirname, 'src/')
      }
    }
  };
};
