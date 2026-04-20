// // metro.config.js

// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");
// const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

// // Get the default Expo config
// let config = getDefaultConfig(__dirname);

// // Wrap the config with NativeWind
// config = withNativeWind(config, {
//   input: "./app/globals.css",
// });

// // Wrap the config with Reanimated
// module.exports = wrapWithReanimatedMetroConfig(config);

// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

// Get the default Expo config
let config = getDefaultConfig(__dirname);

// Wrap the config with NativeWind
config = withNativeWind(config, {
  input: "./app/globals.css",
});

// Wrap the config with Reanimated
module.exports = wrapWithReanimatedMetroConfig(config);

