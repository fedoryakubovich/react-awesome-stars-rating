const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './examples/index.html',
  filename: './index.html',
});

module.exports = {
  entry: ['./examples/index.js'],
  output: {
    filename: './examples/bundle.js',
    pathinfo: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [htmlWebpackPlugin],
};
