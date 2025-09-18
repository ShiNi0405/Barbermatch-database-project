const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native/Libraries/Utilities/codegenNativeCommands': require.resolve('./metro-empty-module.js'),
};

module.exports = config;