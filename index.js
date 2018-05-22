const puppeteer = require("puppeteer");
const url = require("url");

const inputUrl = "https://coinmarketcap.com/";
const originalHost = url.parse(inputUrl).hostname;
let count = 0;
let result = {}

const insertEntry = (url) => {
  const exists = result.hasOwnProperty(url.hostname)
  if (exists) {
    result[url.hostname].push(url.path)
  } else {
    result[url.hostname] = [url.path]
  }
}

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", req => {
    const thisURL = url.parse(req._url);
    const ignore = thisURL.hostname.includes(originalHost)
    if (!ignore) {
      insertEntry(thisURL)
      count++;
    }
    
    req.continue();
  });

  await page.goto(inputUrl);
  await browser.close();
  console.log(result)
  console.log(count);
};

main().catch(error => console.log("error:", error));
