const puppeteer = require('puppeteer');

const scraperObject = {
    url: 'https://richpanel.com/',
    
    async scraper(browser){
        
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        
        await page.goto(this.url);
         // Wait for the required DOM to be rendered
        //console.log(await page.goto(this.url));

        const dimensions = await page.evaluate(() => {
        return {width: document.documentElement.clientWidth,height: document.documentElement.clientHeight,deviceScaleFactor: window.devicePixelRatio,};});
        console.log('Dimensions:', dimensions);

        let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('a.storylink');
                items.forEach((item) => {
                    results.push({
                        url:  item.getAttribute('href'),
                        text: item.innerText,
                    });
                });
                return results;
                console.log(results);
            })
        //const a = await page.waitForSelector('.headers');
        // Get the link to all the required books
        
        //console.log(a);

    }
}

module.exports = scraperObject;