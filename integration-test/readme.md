# Webelexis integration test

This launches the server and then runs a puppeteer script on the client.
Note: `npm install` will load a significant amount of data (e.g. the whole chromium browser) 

Run the integration suite with `npm test`
Expects an existing elexis database and a webelexis server configured for that database.