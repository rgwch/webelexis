# Webelexis Client v3.5

Now created with [svelte](https://svelte.dev/)

Current work covers creation and handling of bills (conformant to the new swiss QR-Bill standard),

## Prepare

For testenvironment on copy of actual Elexis database, create a ../server/config/debug.js and enter there existing user credentials (see debug-sample.js). This will log that user automatically in in development mode and select a patient with lastname "Testperson" automatically.

## Launch

- start server (in directory ../server)
- in client:
- npm i
- npm run dev

navigate to `http://localhost:3000`

## Run tests

npm test

## Run Storybook (for UI development)

npm run storybook
