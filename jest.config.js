// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	testEnvironment: 'node',
	projects: [
		{
			displayName: 'test',
			clearMocks: true,
			coverageDirectory: 'reports/coverage',
			// An array of regexp pattern strings used to skip coverage collection
			coveragePathIgnorePatterns: [
				'/node_modules/',
				'/config/'
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
				'<rootDir>/src/**/*.js',
				'<rootDir>/tests/**/*.js',
				// '<rootDir>/examples/**/*.js',
				'<rootDir>/config/**/*.js'
			]
		}
	]
};
