const esb = require('elastic-builder'); // the builder


// function queryOrderNumber(orderNumber) {
//   try {
//     var query = { "query": {
//       "match": {
//         "orderNumber":orderNumber
//         }
//       }
//     }
// const requestBody = esb.requestBodySearch()
// .query(esb.matchQuery('orderNumber', orderNumber));
//     console.log("query" , query );
//     return query

//   } catch (err) {
//     console.error(`An error occurred while creating queryParams`);
//     console.error(err);
//   } 
// }

function queryOrderNumber(orderNumber) {
  try {

    const requestBody = esb.requestBodySearch().query(
      esb.boolQuery()
        .must(esb.matchQuery('orderNumber', orderNumber))
    );

    console.log("query", requestBody.toJSON());
    return requestBody.toJSON()
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
}


function queryOLIndex(orderHeaderKey) {
  try {
    const qry = esb.requestBodySearch().query(
      esb.boolQuery().must([
        esb.matchQuery('orderHeaderKey', orderHeaderKey),
      ])
    );
    console.log("queryOLIndex", qry.toJSON());
    queryOLIndexWithItem(orderHeaderKey,["item1","item2"]);
    return qry.toJSON();
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
}

function queryOLIndexWithItem(orderHeaderKey,itemId) {
  try {
    const qry = esb.boolQuery()
      .must(esb.termQuery('orderHeaderKey', orderHeaderKey))
      .should([
        esb.termsQuery('itemId', itemId)
      ])
      .minimumShouldMatch(1)
      .boost(1.0);
    console.log("new queryOLIndex", qry.toJSON());
    return qry.toJSON();
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
}


function getESQuery(input) {
  let output = {}
  let myJson1 = []
  let myJson2 = {}
  let outerJson = []
  let innerJson = {}
  let input = { orderNumber: '123456', itemId: ['000032736', '000067003'] }
  let arr = Object.keys(input)
  for (let i in arr) {
    if (typeof (input[arr[i]]) == "object") {
      let data = input[arr[i]]
      data.map(x => {
        innerJson = {}
        innerJson[arr[i]] = x
        outerJson.push({ "bool": { "should": [{ "match": innerJson }], "minimum_should_match": 1 } })
      })
      let finalJson = { "bool": { "should": outerJson, "minimum_should_match": 1 } }
      arr[i] = finalJson
    }
    else {
      myJson2 = {}, myJson1 = {}
      myJson2[arr[i]] = input[arr[i]]
      myJson1 = { "bool": { "should": [{ "match": myJson2 }], "minimum_should_match": 1 } }
      arr[i] = myJson1
    }
  }
  output = { "query": { "bool": { "must": [], "filter": [{ "bool": { "filter": arr } }], "should": [], "must_not": [] } } }
  console.log(output)
  return output
}


function queryOrderHeaderKey(orderHeaderKey) {
  try {
    console.log("orderHeaderKey" + orderHeaderKey);
    var query = {
      "query": {
        "match": {
          "orderHeaderKey": orderHeaderKey
        }
      }
    }
    console.log("query-shipment", query);
    return query

  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }

}

function queryShipmentKey(shipmentKey) {
  try {
    console.log("shipmentKey" + shipmentKey);
    var query = {
      "query": {
        "match": {
          "shipmentKey": shipmentKey
        }
      }
    }
    console.log("query", query);
    return query

  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }

}


module.exports = {
  queryOrderNumber,
  queryOLIndex,
  queryOrderHeaderKey,
  queryShipmentKey
}


/**
module.exports = {
    "size": 10,
    "from": 0,
    "query": {
      "match_all": {}
    }
  };
 */
