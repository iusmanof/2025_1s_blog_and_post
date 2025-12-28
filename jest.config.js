/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    testMatch: ["**/__tests__/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],

    transform: {
        "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },

    // 👇 важно для monorepo / pnpm / absolute imports
    modulePaths: ["<rootDir>"],

    // 👇 чтобы Jest не лез в dist
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
