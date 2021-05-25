import { IURLObj } from "./interface";
import { checkDuplication, generateSetKey } from "./utility";

const _URLMAPPER = new Map();
const _visitedURL = [];

export const getMapper = () => {
    return _URLMAPPER;
}

export const setMapper = (value: IURLObj) => {
    const setKey = generateSetKey(value.url);
    if(!checkDuplication(_URLMAPPER, value, setKey)) {
        _URLMAPPER.set(setKey, value);
    }
}

export const getMapperLength = () => {
    return _URLMAPPER.size;
}

export const getVisited = () => {
    return _visitedURL;
}

export const setVisitedUrl = (url: string) => {
    _visitedURL.push(url);
}
