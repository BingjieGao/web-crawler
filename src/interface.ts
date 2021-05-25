export interface ICrawlerConfig {
    seedURL: string;
    maxPageNum: number;
    maxDepth: number
}
export interface IURLObj {
    url: string;
    title: string;
    parentTitle: string;
    depth: number
}