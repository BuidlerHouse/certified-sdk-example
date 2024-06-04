const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'node_modules/certified-sdk')
        ],
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      });

      webpackConfig.resolve.extensions.push('.ts', '.tsx');
      return webpackConfig;
    },
  },
};
