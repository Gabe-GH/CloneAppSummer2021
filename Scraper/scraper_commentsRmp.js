const puppeteer = require('puppeteer');

// async function getCSCICommentsData() {


//     const brower = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(rmp_URL);

//     let content = await page.$eval("")
// }

async function clickOnSelector(page, selector){
    const [element] = await page.$x(selector);
    if (element) {
        await element.click();
        console.log(`Element has been clicked`);
    } else {
        return undefined;
    }
}


(async () => {

    const rmp_URL = `https://www.ratemyprofessors.com/`

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(rmp_URL);
    await page.waitForSelector('img[alt="Banner Close Icon"]')

    await clickOnSelector(page, "/html/body/div[5]/div/div/img");
    await clickOnSelector(page, '/html/body/div[2]/div/div/div[3]/div[1]/div[4]');
    await clickOnSelector(page, `/html/body/div[2]/div/div/div[3]/div[1]/div[3]/div[2]/input`);

    await page.focus('[type="text"]');
    await page.keyboard.type('John Abraham', {delay: 50});
    await page.keyboard.press('Enter');

    const title = await page.title();
    console.info(`The title is: ${title}`);


    await browser.waitForTarget(() => false);
    await browser.close();
})();