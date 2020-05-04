var esclient = require('./elastic');
const elasticSearchSchema = require('./elastic.schema');


const {
   ElasticSearchClient,
   ElasticSearchClientAsync
 } = require('./es-search');

 
 (async function main() {

  let input="{ 'orderLines':[ { 'lineSeqNo': '1.1', 'itemId': '00750222216335' }, { 'lineSeqNo': '4.1', 'itemId': '00084802400005' } ] }";
  
    const isElasticReady = await esclient.checkConnection();
     const orderIndex = await ElasticSearchClient('orderline_pqa_v1', { ...elasticSearchSchema.queryIndexWithKeyAndInput("orderHeaderKey","xyz",input)});

     let _source = orderIndex.body.hits.hits;
     _source.map((item, i) => {
       _source[i] = item._source
      //  console.log("_source[i]:" +i ," : \n\n", _source[i]);
      //  console.log("\n\n---------------------------\n\n");
     });
      
  })();