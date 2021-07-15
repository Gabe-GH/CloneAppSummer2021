const puppeteer = require('puppeteer');

(async() => {
    const UTRGVstaff_URL = `https://www.utrgv.edu/csci/faculty/index.htm`

    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    
    await page.goto(UTRGVstaff_URL);

    const names = await page.$$eval("div.listing p strong",
        elements => elements.map(names => names.textContent));
    
    const emails = await page.$$eval("div.listing p a:last-child",
        elements => elements.map(emails => emails.textContent));
    
    
        
    console.log(names);
    console.log(emails);
    
    browser.close();
    
})();