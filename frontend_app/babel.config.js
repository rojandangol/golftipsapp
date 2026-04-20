//  Cite: a preset is a set of plugins used to support particular language features:
//  https://www.nativewind.dev/getting-started/installation#3-add-the-babel-preset
// m

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};