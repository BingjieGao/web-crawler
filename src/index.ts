"use strict"

import WebCrawler from "./web-crawler";

const crawlerInstance = new WebCrawler({
    seedURL: "https://monzo.com",
    maxPageNum: 10,
    maxDepth: 2
});

crawlerInstance.depthFirstTraversal(0)
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })