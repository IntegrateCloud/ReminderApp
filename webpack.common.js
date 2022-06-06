const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    ticket_sidebar: ['./src/ticket_sidebar.js'],
    nav_bar: ['./src/nav_bar.js'],
  },
  output: {
    path: path.resolve('dist', 'assets'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
    ],
  },
  externals: {
    zendesk_app_framework_sdk: 'ZAFClient',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: true,
      filename: 'ticket_sidebar.html',
      chunks: ['ticket_sidebar'],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: true,
      filename: 'nav_bar.html',
      chunks: ['nav_bar'],
    }),
  ],
};
