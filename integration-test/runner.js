const player = require('puppeteer')
require('chai').should()

describe('webelexis', () => {
    let browser;
    let page;

    before(async () => {
        browser = await player.launch({ headless: false, slowMo: 10, defaultViewport: { width: 1024, height: 800 } });
        page = await browser.newPage();
    })
    after(async () => {
        browser.close()
    })
    it("should launch Webelexis", async () => {
        await page.goto("http://localhost:3030");
        await page.waitForSelector('input#username')
        await page.$eval("input#username",i=>i.value="test")
        await page.$eval('input#password',p=>p.value="test")
        await page.click('button[type="submit"]')
        await page.screenshot({path: "launched.jpg"})
        
    }).timeout(20000)
})
