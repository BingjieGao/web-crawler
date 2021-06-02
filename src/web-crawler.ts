import { ICrawlerConfig } from "./interface"

import { AxiosResponse } from "axios";
import cheerio from "cheerio";
import {_sanitize_string as sanitizer, fetchURLHTML, trimText, checkVisited } from "./utility";
import CocurrentPool from "./cocurrent-pool";
import { getMapper, getMapperLength, getVisited, setMapper, setVisitedUrl } from "./constants";
import { debug } from "console";
import { logger } from "./logger";

var hostMatcher = /^((http[s]?\:\/\/)?(([a-z]{2,10}\.)*([a-z]{2,30}(\.))(([a-z]{2,2}(\.)))?([a-z]{2,6})))+(([\/]+[\w-\?\=\.]{1,}[\/]?)*)$/
const regexMatcher = /^https:\/\/monzo.com\S+/gi;
const resourceMatcher = new RegExp("^(?!www\.|(?:http|ftp)s?://|[A-Za-z]:\\|//).*");
const cocurrentPool = new CocurrentPool(2);

export default class WebCrawler {
    public seedURL: string = "https://google.com";
    public maxPageNum: number = 1;
    public maxDepth: number = 1;
    public regexMatcher: RegExp = /https:\/\/google.\S+/gi


    constructor(crawlerConfig:ICrawlerConfig) {
        this.seedURL = crawlerConfig.seedURL;
        this.maxPageNum = crawlerConfig.maxPageNum;
        this.maxDepth = crawlerConfig.maxDepth;
    }

    private _resourceLink = (itemLink: string) => {
        if(hostMatcher.test(itemLink)) {
            return itemLink;
        } else {
            return `${this.seedURL}${itemLink}`;
        }
    }


    public depthFirstTraversal = (depth: number, currentURL?: string, parentTitle?: string) => {
        // return new Promise((resolve, reject) => {
            return fetchURLHTML(currentURL || this.seedURL)
                .then((response: AxiosResponse) => {
                    const $ = cheerio.load(response.data);

                    const linkMap = $("a").filter((i, el) => {
                        return regexMatcher.test($(el).attr("href")) || resourceMatcher.test($(el).attr("href"))
                    });
                    // https://app.adjust.com

                    // console.log("the link map with filter is\n");
                    // console.log(linkMap)
                    const mainTitle = $("title").text();
                    linkMap.each((index, el) => {
                        const itemTitle = sanitizer($(el).text());
                        const itemLink = this._resourceLink($(el).attr("href"));
                        // console.log(`currently Requesting url ${itemLink}`);
                        if(depth >= this.maxDepth) {
                            // back from the first one
                            depth = 0;
                        }
                        if(getMapperLength() >= this.maxPageNum || checkVisited(getVisited(), itemLink) || !regexMatcher.test(itemLink)) {
                            return;
                        }
                        else {
                            setMapper({
                                parentTitle:trimText(parentTitle || mainTitle || ""),
                                title: trimText(itemTitle),
                                url: itemLink,
                                depth: depth,
                            });

                            setVisitedUrl(itemLink);
                            logger.info({function: "web-crawler :: depthFirstTraversal", Msg: `Successfully running over link:  ${itemLink}`});
                            cocurrentPool.eQueue([this.depthFirstTraversal(depth++, itemLink, itemTitle)]);
                        }
                    });
                    return getMapper();
                })
                .catch((error) => {
                    console.log("Caught error from depth Travesal");
                    logger.error({function: "web-crawler :: depthFirstTraversal", errorMsg: error.message});
                    // throw new Error(error);
                });
        // });

    }


}