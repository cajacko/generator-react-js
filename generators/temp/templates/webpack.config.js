const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      // Out put with cache buster names in production
      filename: (() => {
        if (isProduction) {
          return '[chunkhash].[name].js';
        }

        // No hash for dev as it adds to compliation time
        return '[name].js';
      })(),

      // Change build path for production and dev, makes it more obvious when
      // production build needs to happen
      path: (() => {
        if (isProduction) {
          return path.resolve(__dirname, 'dist/prod');
        }

        return path.resolve(__dirname, 'dist/dev');
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
      (() => {
        if (isProduction) {
          return new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            beautify: false,
            mangle: {
              screw_ie8: true,
              keep_fnames: true
            },
            compress: {
              screw_ie8: true,
              warnings: false
            },
            comments: false
          });
        }

        return () => {};
      })(),

      (() => {
        if (isProduction) {
          return new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
          });
        }

        return () => {};
      })(),

      (() => {
        if (isProduction) {
          return new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
          });
        }

        return () => {};
      })(),

      // Bundle analyzer lets you observe what each webpack budle is made up of
      // Generates a report.html file in the output folder
      (() => {
        if (isProduction) {
          return new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
          });
        }

        return () => {};
      })(),

      // Remove old budles before creating new ones
      new WebpackCleanupPlugin(),

      new HtmlWebpackPlugin(),

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
      // TODO: This doesn't seem to change often, can this be included in
      // vendor?
      new webpack.optimize.CommonsChunkPlugin({
        names: ['manifest'] // Specify the common bundle's name.
      }),

      // Improves logging in the console
      new webpack.HashedModuleIdsPlugin(),

      // Better hashing than the standard
      new WebpackChunkHash(),

      // Capture the manifest in a json file
      // This outputs a json file with each easy bundle name mapped to its hash
      // name. Then our templating engine can require the correct file
      // Only in production though, as no hashes are used otherwise
      (() => {
        if (isProduction) {
          return new ManifestPlugin();
        }

        return () => {};
      })()
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
