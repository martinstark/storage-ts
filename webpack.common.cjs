module.exports = {
  entry: ["./src/index"],
  experiments: {
    outputModule: true,
  },
  output: {
    library: {
      type: "module",
    },
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.m?tsx?$/,
        exclude: [/node_modules/],
        use: ["swc-loader"],
      },
    ],
  },
  devtool: "source-map",
  plugins: [],
};
