const fs = require("fs");
const puppeteer = require("puppeteer");

function extractItems() {
  const extractedElements = document.querySelectorAll(".soundList__item");
  const items = [];
  for (let node of extractedElements) {
    items.push({
      name: node.querySelector(".soundTitle__title")
        ? node.querySelector(".soundTitle__title").innerText
        : "null",
      datePosted: node.querySelector(".soundTitle__uploadTime time")
        ? node
            .querySelector(".soundTitle__uploadTime time")
            .getAttribute("datetime")
        : "null",
      tag: node.querySelector(".soundTitle__tagContent")
        ? node.querySelector(".soundTitle__tagContent").innerText
        : "null",
      coverUrl: node.querySelector(".sound__coverArt > .sc-artwork > span")
        ? node.querySelector(".sound__coverArt > .sc-artwork > span").style
            .backgroundImage
        : "null",
      link: node.querySelector(".soundTitle__title")
        ? node.querySelector(".soundTitle__title").getAttribute("href")
        : "null",
      reposts: node.querySelector(".sc-button-repost")
        ? node.querySelector(".sc-button-repost").innerText
        : "null",
      likes: node.querySelector(".sc-button-like")
        ? node.querySelector(".sc-button-like").innerText
        : "null",
    });
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("window.scrollY");
      await page.evaluate("window.scrollBy(0, window.innerHeight)");
      await page.waitForFunction(`window.scrollY > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
    await page.evaluate("window.scrollBy(0, window.innerHeight)");
    items = await page.evaluate(extractItems);
  } catch (e) {
    console.log(e);
  }
  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the demo page.
  await page.goto("https://soundcloud.com/mrsuicidesheep/tracks");

  // Scroll and extract items from the page.
  const data = await scrapeInfiniteScrollItems(page, extractItems, 100);

  // Save extracted items to a file.
  await fs.writeFile(
    "./src/data/sounds.json",
    JSON.stringify(data, null, 2),
    (err) => (err ? console.log(err) : null)
  );
  // Close the browser.
  await browser.close();
})();
