var esclient = require('./elastic');
const server  = require("./server");
(async function main() {

    const isElasticReady = await esclient.checkConnection();
  
    if (isElasticReady) {

      server.start();
    }
  
  })();