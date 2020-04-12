

function queryOrderNumber(orderNumber) {
  try {
    var query = { "query": {
      "match": {
        "orderNumber":orderNumber
      }
    }
  }
  console.log("query" , query );
  return query
  
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  } 
}

function queryOLIndex(inputjson) {
  try {
  var query = getElasticQuery(inputjson)
  console.log("query" , query );
  return query
  
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
  
}

  
function queryOrderHeaderKey(orderHeaderKey) {
  try {
    console.log("orderHeaderKey" + orderHeaderKey );
    var query = { "query": {
      "match": {
        "orderHeaderKey":orderHeaderKey
      }
    }
  }
  console.log("query" , query );
  return query
  
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
  
}

function queryShipmentKey(shipmentKey) {
  try {
    console.log("shipmentKey" + shipmentKey );
    var query = { "query": {
      "match": {
        "shipmentKey":shipmentKey
      }
    }
  }
  console.log("query" , query );
  return query
  
  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
  
}


module.exports = {
  queryOrderNumber,
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
  