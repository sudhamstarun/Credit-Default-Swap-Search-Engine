// Modules
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackCleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

/**
 * Make webpack config
 * @param {object} options Builder options
 * @param {boolean} options.TEST Generate a test config
 * @param {boolean} options.BUILD Generate a build config
 * @returns {object} Webpack configuration object
 */
module.exports = function makeWebpackConfig(options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  const BUILD = !!options.BUILD;
  const TEST = !!options.TEST;
  const ENVIRONMENT = options.ENVIRONMENT;

  /**
   * Environment values
   */


  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  const config = {};
  const packDate = { date: new Date().toISOString() };
  fs.writeFile('webpack.date.json', JSON.stringify(packDate));
  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (TEST) {
    config.entry = {};
  }
  else {
    // config.context = __dirname + "/app/js",
    // config.entry = {
    //   app: './app.js'
    // }
    config.entry = './src/index.js';
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {};
  }
  else {
    config.output = {
      // Absolute output directory
      path: path.join(__dirname, 'dist'),

      // Output path from the view of the page
      // Uses webpack-dev-server in development, see: http://webpack.github.io/docs/webpack-dev-server.html#combining-with-an-existing-server
      publicPath: BUILD ? './' : 'http://localhost:8080/dist',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
    };
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map';
  }
  else if (BUILD) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval';
    // config.devtool = 'inline-source-map'
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file',
    },
    {
      // similar to file loader but can inline small files: https://github.com/webpack/url-loader
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'url?limit=8192', // inlines if <8k
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      // Allow us to load CSV files as strings.
      test: /\.csv$/,
      loader: 'raw-loader',
    },
  ] };

  // ISPARTA LOADER
  // Reference: https://github.com/ColCh/isparta-instrumenter-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and files that end with .test.js and .test.jsx
  if (TEST) {
    config.module.preLoaders.push({
      test: /\.(js|jsx)$/,
      exclude: [
        /node_modules/,
        /\.test\.(js|jsx)$/,
      ],
      loader: 'isparta-instrumenter',
    });
  }

  // JSX LOADER
  // Transpile .jsx files using babel-loader
  const jsxLoader = {
    test: /\.(js|jsx)$/,
    loader: 'babel',
    exclude: [
      /node_modules/,
    ],
  };

  // Add react-hot-loader when not in build or test mode
  if (!BUILD && !TEST) {
    // Reference: https://github.com/gaearon/react-hot-loader
    // This will reload react components without refresh
    jsxLoader.loader = 'react-hot!' + jsxLoader.loader;
  }

  // Add jsxLoader to the loader list
  config.module.loaders.push(jsxLoader);

  // Stylesheets
  // Reference: http://webpack.github.io/docs/stylesheets.html
  //
  // Reference: https://github.com/webpack/css-loader
  // Allow loading css through js
  //
  // Reference: https://github.com/postcss/postcss-loader
  // Postprocess your css with PostCSS plugins
  const cssLoader = {
    test: /\.css$/,
    loader: 'style!css' + (BUILD ? '' : '') + '!autoprefixer?browsers=last 2 version',
  };

  // Skip loading css in test mode
  if (TEST) {
    // Reference: https://github.com/webpack/null-loader
    // Return an empty module
    cssLoader.loader = 'null';
  }

  // Add cssLoader to the loader list
  config.module.loaders.push(cssLoader);

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoErrorsPlugin(),

    new WebpackNotifierPlugin(),

    new CopyWebpackPlugin([
        { from: './src/csv', to: './csv' },
    ]),

    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    // new ExtractTextPlugin('[name].[hash].css', {
    //   disable: !BUILD || TEST
    // }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Can be used to replace other values as well
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENVIRONMENT), // see: https://github.com/petehunt/webpack-howto for a trick for hiding dev and pre-release features
    }),

    // Reference: https://www.npmjs.com/package/html-webpack-plugin
    // Uses index.html as template, appends scripts/css, and moves to templates/app
    // Note: npm dev script needs to run webpack regularly the first time to make sure this file
    // actually gets emitted to the file system rather than kept in memory
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
  ];

  // Skip rendering index.html in test mode
  // if (!TEST) {
  //   // Reference: https://github.com/ampedandwired/html-webpack-plugin
  //   // Render index.html
  //   config.plugins.push(
  //     new HtmlWebpackPlugin({
  //       title: 'Web application',
  //       minify: BUILD
  //     })
  //   )
  // }

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      new WebpackCleanPlugin(['./dist']),
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin()
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './dist',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
    },
  };

  // config.node = {
  //   console: true,
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   dns: 'empty',
  //   dgram: 'empty',
  // };

  return config;
};
