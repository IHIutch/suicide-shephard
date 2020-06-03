const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://soundcloud.com/mrsuicidesheep/tracks");
  const data = await page.$$eval(".soundList__item", (nodes) => {
    return nodes.map((node) => {
      return {
        title: node.querySelector(".soundTitle__title").innerText,
        datePosted: node
          .querySelector(".soundTitle__uploadTime time")
          .getAttribute("datetime"),
        tag: node.querySelector(".soundTitle__tagContent").innerText,
        // coverArt: node.querySelector(".sound__coverArt").getAttribute(href),
        // link: node.querySelector(".soundTitle__title").getAttribute(href),
      };
    });
  });

  fs.writeFile("./data/sounds.json", JSON.stringify(data, null, 2), (err) =>
    err ? console.log(err) : null
  );

  await browser.close();
})();
