const config = require('./config');
const { Client } = require('@elastic/elasticsearch');
var quotes = require('./data/quotes.json');
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

//   /Users/t0p02d0/cert/mx-elk-elastic-search-dev.walmart.com.cer 

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex(index) {
    try {
  
      await esclient.indices.create({ index });
      console.log(`Created index ${index}`);
  
    } catch (err) {
  
      console.error(`An error occurred while creating the index ${index}:`);
      console.error(err);
  
    }
  }
  
  async function deleteIndex(index) {
    try {
  
      esclient.indices.delete({ index: index}, function (err, resp, status) {
        if (err) {
            console.log(err);
        } else {
            console.log(status)
            console.log("delete", resp);
        }
    });
      console.log(`deleteIndex index ${index}`);
  
    } catch (err) {
  
      console.error(`An error occurred while creating the index ${index}:`);
      console.error(err);
  
    }
  }
  


  /**
   * @function setQuotesMapping,
   * @returns {void}
   * @description Sets the quotes mapping to the database.
   */
  
  async function setQuotesMapping () {
    try {
      const schema = {
        quote: {
          type: "text" 
        },
        author: {
          type: "text"
        }
      };
    
      await esclient.indices.putMapping({ 
        es_index, 
        es_type,
        include_type_name: true,
        body: { 
          properties: schema 
        } 
      })
      
      console.log("Quotes mapping created successfully");
    
    } catch (err) {
      console.error("An error occurred while setting the quotes mapping:");
      console.error(err);
    }
  }
  
  /**
   * @function checkConnection
   * @returns {Promise<Boolean>}
   * @description Checks if the client is connected to ElasticSearch
   */
  
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


 const esAction = {
  index: {
    _index: config.es_index,
    _type: config.es_type,
  }
};

   async function populateDatabase() {

   const docs = [];

   for (const quote of quotes) {
     docs.push(esAction);
     docs.push(quote);
   }

   return esclient.bulk({ body: docs });
  
 }
  


  module.exports = {
    esclient,
    es_index,
    es_type,
    setQuotesMapping,
    checkConnection,
    createIndex,
    deleteIndex,
    populateDatabase,
  };