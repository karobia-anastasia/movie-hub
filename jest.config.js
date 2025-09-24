module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // For React components
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Maps @/ imports
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
