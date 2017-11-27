const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/Main.jsx',
    './src/styles/reset.css',
    './src/styles/style.css'
  ],
  output: {
    filename: 'dist/js/bundle.js'
  },
  plugins: [
    new UglifyJSPlugin({
      test: /\.js($|\?)/i,
      sourceMap: true
    }),
    new ExtractTextPlugin("./dist/css/style.min.css")
  ],
  // plugins: [
  //   new Dotenv({
  //     path: './.env'
  //   })
  // ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?minimize'
        })
      }
    ]
  }
};