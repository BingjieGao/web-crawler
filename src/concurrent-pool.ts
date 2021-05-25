import { debug } from "console";
import { logger } from "./logger";

export default class ConcurrentPool {
    private _max_queue_length: number;
    private _concurrent_number: number;
    private _queue: Array<any>;
    private _results: Array<any>;
    public promises: Array<any>;


    constructor(_max_quene_length: number) {
        this._max_queue_length = _max_quene_length;
        this._concurrent_number = 0;
        this._queue = [];
        this._results = [];
        this.promises = [];
    }

    private _executor = <T>(promise, resolve, reject) => {
        if(this._concurrent_number >= this._max_queue_length) {
            this._queue.push(promise);
            return;
        }
        this._concurrent_number++;
        if(typeof promise === "function") {
            promise()
                .then((res) => {
                    this._results.push(res);
                    this._concurrent_number--;

                    if(this._queue.length === 0 && this._concurrent_number === 0) {
                        return resolve(this._results);
                    }

                    if(this._queue.length > 0) {
                        this._executor(this._queue.shift(), resolve, reject);
                    }
                })
                .catch(reject)
        }

        return;

    }

    public eQueue = (promises = []) => {
        this.promises = this.promises.concat(promises);
        return this._concurrentExecutor();
    }
    private _concurrentExecutor = () => {
        return new Promise((resolve, reject) => {
            for(const promise of this.promises) {
                this._executor(promise, resolve, reject);
            }
        })
    }
}