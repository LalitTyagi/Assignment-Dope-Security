export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                target: 'ES2022',
                module: 'ESNext',
                moduleResolution: 'bundler',
                lib: ['DOM', 'DOM.Iterable', 'ESNext'],
                allowImportingTsExtensions: true,
                verbatimModuleSyntax: false,
                jsx: 'react-jsx',
                esModuleInterop: true,
                types: ['node', 'jest', '@testing-library/jest-dom'],
            }
        }],
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
