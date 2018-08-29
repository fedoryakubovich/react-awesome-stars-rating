const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './example/index.html',
  filename: './index.html',
});

module.exports = {
  entry: ['./example/index.js'],
  output: {
    filename: './example/bundle.js',
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
