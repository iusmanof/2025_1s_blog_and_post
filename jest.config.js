/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/(?!uuid)/"],
  transform: {
    // '^.+\\.ts$': ['ts-jest', { useESM: true }],
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
    "^.+\\.js$": "babel-jest",
  },
  moduleNameMapper: { "^uuid$": "uuid" },
};
