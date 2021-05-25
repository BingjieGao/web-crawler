import md5 from "md5";

import axios, { AxiosError, AxiosResponse } from "axios";
import { IURLObj } from "./interface";


export const _sanitize_string = (originalString: string) => {
    return originalString.replace(/[\n\t\r]/g,"").trim();
}

export const omit = (key, obj) => {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}

export const fetchURLHTML = (currentURL: string) => {
    return new Promise((resolve, reject) => {
        console.log(`requesting url with ${currentURL}`)
        axios.get(currentURL)
            .then((response: AxiosResponse) => {
                resolve(response);
            })
            .catch((error: AxiosError) => {
                console.log(error)
                reject(error);
            })
    })
}
export const generateSetKey = (urlString: string) => {
    if(urlString) {
        return md5(urlString);
    }
}
export const checkDuplication = (mapper: Map<string, IURLObj>, urlObj: IURLObj, setKey: string) => {
    if(!mapper.get(setKey) ){
        return false;
    }
    // || (mapper.get(setKey) as IURLObj).depth > urlObj.depth
    return true;
}

/**
 * 
 * @param urlArray 
 * @param url 
 * @returns visited as true
 */
export const checkVisited = (urlArray: Array<string>, url: string) => {
    return urlArray.indexOf(url) !== -1;
}
export const trimText = (titleString: string) => {
    return titleString.trim().replace(/[\n\t\r]/g,"").trim();
}