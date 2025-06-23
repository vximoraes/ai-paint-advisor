module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/tests/unit/**/*.test.ts',
        '**/services/tests/**/*.test.ts',
        '**/tests/**/*.test.ts'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};