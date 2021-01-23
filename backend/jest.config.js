module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  collectCoverageFrom: [
    'src/**/*.(t|j)s', '!src/**/*.spec.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testRegex: '.*\\.spec\\.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
    },
    {
      displayName: 'e2e',
      testRegex: '.e2e-spec.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
    },
  ],
};
