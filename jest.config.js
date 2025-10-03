/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node', // так как тестируем серверный код
    testMatch: ['**/__tests__/**/*.test.ts'], // где искать тесты
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};