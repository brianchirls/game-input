// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	testEnvironment: 'node',
	coverageDirectory: 'reports/coverage',
	projects: [
		{
			displayName: 'test',
			clearMocks: true,
			// An array of regexp pattern strings used to skip coverage collection
			coveragePathIgnorePatterns: [
				'/node_modules/',
				'/config/',
				'/reports/',
				'/build/'
			],
			testMatch: [
				'<rootDir>/tests/**/[^\\.]*.[jt]s',
				'**/?(*.)+(spec|test).[tj]s'
			],
			setupFilesAfterEnv: ['<rootDir>/tools/jest.helpers.js']
		},
		{
			displayName: 'lint',
			runner: 'jest-runner-eslint',
			testMatch: [
				'<rootDir>/src/**/*.js?(x)',
				'<rootDir>/tests/**/*.js?(x)',
				'<rootDir>/tools/**/*.js',
				'<rootDir>/config/**/*.js'
			]
		}
	]
};
