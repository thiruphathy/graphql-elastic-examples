const {esclient} = require('./elastic');
const elasticSearchSchema = require('./elastic.schema');
const config = require('./config');

/**
 * TODO Ping the CLIENT to be sure 
 * *** ElasticSearch *** is up
 */
esclient.ping(function (error) {
  error
    ? console.error('ElasticSearch cluster is down!'+error)
    : console.log('ElasticSearch is ok');
});

function ElasticSearchClient(index,body) {


  try {
    console.log("index" , index);

    // perform the actual search passing in the index, the search query and the type
    return esclient.search({index: index, body: body})
    
  } catch (err) {

    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

  }

}

async function ElasticSearchClientAsync(index,body) {


  try {
    console.log("index" , index);

    // perform the actual search passing in the index, the search query and the type
    return await esclient.search({index: index, body: body})
    
  } catch (err) {

    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

  }

}


module.exports = {
  ElasticSearchClient,
  ElasticSearchClientAsync
};