# Webelexis Client v3.5

Now created with [svelte](https://svelte.dev/)

Current work covers creation and handling of bills (conformant to the new swiss QR-Bill standard),

## Prepare

For test on copy of actual Elexis database change pm.fetch() and um.fetch() in main.ts to existing patient and username. This will log that user automatically in in development mode and select the given patient automatically.

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
