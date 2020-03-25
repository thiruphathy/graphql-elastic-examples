const config = require('./config');
const { Client } = require('@elastic/elasticsearch');
var fs = require('fs');

var esclient = new Client( {
  requestTimeout: 5000,
  node: `https://${config.es_user}:${config.es_pass}@${config.es_host}:${config.es_port}`, 

  ssl: {
      // Load the CA pem as well as the intermediate root pem
        //  ca: [
        //   fs.readFileSync('/Users/t0p02d0/cert/WalmartRootCA-SHA256.cer'), 
        //   fs.readFileSync('/Users/t0p02d0/cert/WalmartIntermediateCA01-SHA256.cer'),
        //   fs.readFileSync('/Users/t0p02d0/cert/WalmartIssuingCA-TLS-02-SHA256.cer'),
        //   fs.readFileSync('/Users/t0p02d0/cert/mx-elk-elastic-search-dev.walmart.com.cer'),
        //   ],

      // This ensures that certificates that are not signed by the 'ca' above get rejected
      rejectUnauthorized: false
  }
});

const es_index      = config.es_index
const es_type       = config.es_type



  function checkConnection() {
    return new Promise(async (resolve) => {
  
      console.log("Checking connection to ElasticSearch...");
      let isConnected = false;
  
      while (!isConnected) {
        try {
  
          await esclient.cluster.health({});
          console.log("Successfully connected to ElasticSearch");
          isConnected = true;
  
        // eslint-disable-next-line no-empty
        } catch (_) {
  
        }
      }
  
      resolve(true);
  
    });
  }




  module.exports = {
    esclient,
    checkConnection
  };