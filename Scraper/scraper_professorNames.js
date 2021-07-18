const puppeteer = require('puppeteer');

async function getCSCIProfessorData() {
    const UTRGVstaff_URL = `https://www.utrgv.edu/csci/faculty/index.htm`

    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    
    await page.goto(UTRGVstaff_URL);

    let department = await page.$eval("h1.department-title", 
        department => department.innerText.trim());

    const names = await page.$$eval("div.listing p strong",
        elements => elements.map(names => names.textContent.trim()));
    
    const emails = await page.$$eval("div.listing p a:last-child",
        elements => elements.map(emails => emails.textContent.trim()));
    
    department = department.split("\n")[0]     
    browser.close();

    const results = [];
    
    for(let i = 0; i < names.length || i < emails.length; i++){
        results.push( { department: department, name: names[i], email: emails[i]});
    };

    return results

};

module.exports = getCSCIProfessorData;