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
    "node_modules/svelte-fa/"
  },
  transform: {
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
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-svelte-events/extend-expect"
  ]

}
