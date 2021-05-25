"use strict";
import { expect } from "chai";
import CocurrentPool from "../src/cocurrent-pool";
const cocurrentPool = new CocurrentPool(3);
const request_count = 10;
const promises = [];
let cocurrentFlag = "green";

for(let i=0;i<request_count;i++) {
    const randomDelay = Math.floor(Math.random() * 10) + 1;

    const promiseFun = () => {
        if(cocurrentPool.getCocurrentCount() > 3) {
            cocurrentFlag = "red";
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({index: i, delay: randomDelay});
            }, randomDelay);
        })
    }
    promises.push(promiseFun);
}

describe('Concurrent Pool should always return the results and not exceeding the number of maximum queue', function() {
    it('Equeue', function() {
        cocurrentPool.eQueue(promises)
            .then((results) => {
                expect(cocurrentFlag).to.equal("green");
                expect((results as Array<any>).length).to.equal(10);
            });
    }); 
  });
