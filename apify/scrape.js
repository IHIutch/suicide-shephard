const Apify = require("apify");

Apify.main(async () => {
  // Apify.openRequestQueue() is a factory to get a preconfigured RequestQueue instance.
  // We add our first request to it - the initial page the crawler will visit.
  const requestQueue = await Apify.openRequestQueue();
  await requestQueue.addRequest({
    url: "https://soundcloud.com/mrsuicidesheep/tracks",
  });

  const crawler = new Apify.PuppeteerCrawler({
    requestQueue,
    launchPuppeteerOptions: {
      // For example, by adding "slowMo" you'll slow down Puppeteer operations to simplify debugging
      // slowMo: 500,
    },
    maxRequestsPerCrawl: 1,
    handlePageFunction: async ({ request, page }) => {
      console.log(`Processing ${request.url}...`);

      // A function to be evaluated by Puppeteer within the browser context.
      const data = await page.$$eval(".soundList__item", ($posts) => {
        const scrapedData = [];

        // We're getting the title, rank and URL of each post on Hacker News.
        $posts.forEach(($post) => {
          scrapedData.push({
            genre: $post.querySelector(".soundTitle__tagContent").innerText,
            title: $post.querySelector(".soundTitle__title").innerText,
          });
        });

        return scrapedData;
      });

      console.log(data);
      // Store the results to the default dataset.
      await Apify.pushData([...data]);
    },

    // This function is called if the page processing failed more than maxRequestRetries+1 times.
    handleFailedRequestFunction: async ({ request }) => {
      console.log(`Request ${request.url} failed too many times`);
      await Apify.pushData({
        "#debug": Apify.utils.createRequestDebugInfo(request),
      });
    },
  });

  // Run the crawler and wait for it to finish.
  await crawler.run();
  console.log("Crawler finished.");
});
