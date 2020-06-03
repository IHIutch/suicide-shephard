// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = function(api) {
  api.loadSource(({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
  });

  api.loadSource((actions) => {
    const split = (val) => {
      return val.split(" - ");
    };

    const soundsData = require("./src/data/sounds.json");
    const collection = actions.addCollection({
      typeName: "sound",
    });

    const nodes = soundsData.map((val, idx) => {
      let temp = split(val.name);
      let cover = val.coverUrl
        ? val.coverUrl.match(/\((.*?)\)/)[1].replace(/('|")/g, "")
        : null;
      return {
        ...val,
        id: idx,
        title: temp[1],
        artist: temp[0],
        coverArt: cover,
      };
    });

    nodes.map((val) => {
      collection.addNode(val);
    });
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
