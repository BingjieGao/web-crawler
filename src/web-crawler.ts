import { ICrawlerConfig } from "./interface"

import { AxiosResponse } from "axios";
import cheerio from "cheerio";
import {_sanitize_string as sanitizer, fetchURLHTML, trimText, checkVisited } from "./utility";
import { logger } from "./logger";
import CocurrentPool from "./concurrent-pool";
import { getMapper, getMapperLength, getVisited, setMapper, setVisitedUrl } from "./constants";

var hostMatcher = /^((http[s]?\:\/\/)?(([a-z]{2,10}\.)*([a-z]{2,30}(\.))(([a-z]{2,2}(\.)))?([a-z]{2,6})))+(([\/]+[\w-\?\=\.]{1,}[\/]?)*)$/
const regexMatcher = /https:\/\/monzo\S+/gi;
const resourceMatcher = /(([\/]+[\w-\?\=\.]{1,}[\/]?)*)$/gi;
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
            return `${this.seedURL}/${itemLink}`;
        }
    }


    public depthFirstTraversal = (depth: number, currentURL?: string, parentTitle?: string) => {
        return new Promise((resolve, reject) => {
            fetchURLHTML(currentURL || this.seedURL)
                .then((response: AxiosResponse) => {
                    const $ = cheerio.load(response.data);
                    const linkMap = $("a").filter((i, el) => 
                        regexMatcher.test($(el).attr("href")) || resourceMatcher.test($(el).attr("href"))
                    );
                    const mainTitle = $("title").text();
                    linkMap.each((index, el) => {
                        const itemTitle = sanitizer($(el).text());
                        const itemLink = this._resourceLink($(el).attr("href"));
                        if(depth >= this.maxDepth || getMapperLength() >= this.maxPageNum || checkVisited(getVisited(), itemLink)) {
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
                            cocurrentPool.eQueue([this.depthFirstTraversal(depth++, itemLink, itemTitle)]);
                        }
                    });
                    resolve(getMapper());
                })
                .catch((error) => {
                    throw new Error(error);
                })
        })

    }


}