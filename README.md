### Bullet Points for necessary components
* Input param:
    * Main URL for starting point
    * Maximum page numbers to be output
    * Layers for depth on crawling
    
* Global configuration file for options
* Necessary loggings including failure list for possible tr-try mechanism
* Unit Test

### How To
* Installation of the dependencies
`npm install`
* Start with existing npm script
`npm run start`
### Issues
* Encountered with 420 too many requests applied single-thread aync functions - cocurrent API call controlled
* Encountered with the insufficient regex matcher issue on how to differentiate the relative resource link vesus the actual absolute link
* 

### TODO
* BFS implementation
* High-avaliablility of the cocurrent pool
* Test coverage
* Better off on the presentation of results

