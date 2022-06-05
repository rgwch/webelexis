module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "../src",
  moduleFileExtensions: ['js', 'ts', 'svelte', 'json'],
  testMatch: [
    //   "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  moduleNameMapper: {
    "^.+\\.css$": "<rootDir>/../.config/stylemock.ts"
  },
  transform: {
    "^.+\\.stories\\.[jt]sx?$": "<rootDir>/../node_modules/@storybook/addon-storyshots/injectFileName",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svelte$": [
      'svelte-jester',
      {
        "preprocess": true,
        compilerOptions: {
        }
      }
    ]
  },
  "transformIgnorePatterns": ["node_modules/(?!(@storybook/svelte)/)"],
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-svelte-events/extend-expect"
  ]

}
