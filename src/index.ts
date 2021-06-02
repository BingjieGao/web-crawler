"use strict"

import { fetchURLHTML } from "./utility";
import WebCrawler from "./web-crawler";

const crawlerInstance = new WebCrawler({
    seedURL: "https://monzo.com",
    maxPageNum: 100,
    maxDepth: 10
});

// fetchURLHTML("https://stackoverflowstack.com/&absdkasj")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   })

try {
    crawlerInstance.depthFirstTraversal(0)
      .then((results) => {
        console.log(results);
      })
      .catch((error) => {
        console.log("Caught error from index file")
        console.log(error);
        return Promise.reject(error);
    });
} catch(error) {
    console.log(error)
}
