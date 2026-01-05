const packageJson = require("./package.json");

module.exports = {
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Inject package.json version as environment variable
      const definePlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === "DefinePlugin"
      );
      if (definePlugin) {
        definePlugin.definitions["process.env.REACT_APP_SCHEMA_VERSION"] =
          JSON.stringify(packageJson.version);
      }
      return webpackConfig;
    },
  },
};
