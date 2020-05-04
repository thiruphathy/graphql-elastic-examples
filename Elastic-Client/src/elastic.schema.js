const esb = require('elastic-builder'); // the builder

function queryIndexWithKeyAndInput(jsonInputStr) {
  try {
    //  let jsonInputStr={ "orders":[ { "customerEmailId": "endinvoive@end.com", "enterpriseKey": "WM_GM", "entryType": "MobileWeb", "documentType": "0001" }, { "customerEmailId": "amkrishan@gmail.com", "enterpriseKey": "WM_GM", "entryType": "MobileWeb", "documentType": "0001" } ] }
    let jsonInputObj = JSON.parse(jsonInputStr)

  } catch (err) {
    console.error(`An error occurred while creating queryParams`);
    console.error(err);
  }
}


function getESQueryForOrder(inputStr, sortByStr, sizeStr) {

  //  let inputStr=[ { 'customerEmailId':'endinvoive@end.com', 'enterpriseKey':'WM_GM', 'entryType':'MobileWeb', 'documentType':'0001', "orderLines":[ { "lineSeqNo": "1.1", "itemId": "00750222216335" }, { "lineSeqNo": "5.1", "itemId": "00697039064008" } ], "shipments": [ { "shipNodeKey": "DC_5468", "shipmentNo": "777856210", "containers":[ { "containerNo": "100045413", "trackingNo": "11332550005" } ] }, { "shipmentNo": "777856211", "containers":[ { "containerNo": "100045399" } ] } ] } ] 
  //  let inputStr=[ { "customerEmailId": "endinvoive@end.com", "enterpriseKey": "WM_GM", "entryType": "MobileWeb", "documentType": "0001" }, { "customerEmailId": "amkrishan@gmail.com", "enterpriseKey": "WM_GM", "entryType": "MobileWeb", "documentType": "0001" } ] 
  
  //  let sortByStr = "{ \"orderCreateTS\": { \"order\": \"asc\" } }"
  let sizeStr = "\"size\": 10"

  let inputObj = JSON.parse(inputStr)

  let arrGrandChild = []
  let arrChild = []

  let sortByObj = JSON.parse(sortByStr)

  let grandChild = { "bool": { "should": arrGrandChild, "minimum_should_match": 1 } }
  let arrParent = []
  let parentQuery = { "query": { "bool": { "filter": arrParent } }, "sort": [sortByObj], sizeStr }
  if (typeof (inputObj) !== 'undefined') {
    inputObj.map(eachJSON => {
      let keys = Object.keys(eachJSON)
      arrChild = []
      console.log(keys)

      let child = { "bool": { "filter": arrChild } }
      keys.map(eachKey => {
        let obj = {}
        obj[eachKey] = eachJSON[eachKey]

        let oneAttribute = { "bool": { "should": [{ "match_phrase": obj }], "minimum_should_match": 1 } }
        arrChild.push(oneAttribute)

      })
      arrGrandChild.push(child)

    })
  }

  arrParent.push(grandChild)
  console.log("arrParent", JSON.stringify(parentQuery))

  return JSON.stringify(parentQuery)

}


function getESQueryForChild(inputStr, sortByStr, keyStr, sizeStr) {

  // Container
  // let inputStr=[ { "containerNo": "100051439", "trackingNo": "42434434286277" } ] 
  // let keyStr = "{\"shipmentKey\": \"20200420070601676074400\"}"
  // let sortByStr = "{ \"shpContainerCreateTS\": { \"order\": \"asc\" } }"

  // OrderLine
  // let inputStr= [ { "lineSeqNo": "14.1", "itemId": "00000000004961" }, { "lineSeqNo": "25.1", "itemId": "00750100310839" } ] 
  // let sortByStr = "{ \"orderLineCreateTS\": { \"order\": \"asc\" } }"
  // let keyStr = "{\"orderHeaderKey\": \"20200327095118652084402\"}"

  // Shipment
  // let inputStr=[ { "shipNodeKey": "DC_5468", "shipmentNo": "777923136" } ] 
  // let keyStr = "{\"orderHeaderKey\": \"20200420070304676072829\"}"
  // let sortByStr = "{ \"shipmentCreateTS\": { \"order\": \"asc\" } }"

  let sizeStr = "\"size\": 10"

  let inputObj = JSON.parse(inputStr)
  let keyObj = JSON.parse(keyStr)
  let sortByObj = JSON.parse(sortByStr)

  let arrGrandChild = []
  let arrChild = []


  let grandChild = { "bool": { "should": arrGrandChild, "minimum_should_match": 1 } }
  let arrParent = []
  let parentQuery = { "query": { "bool": { "filter": arrParent } }, "sort": [sortByObj], sizeStr }
  let headerQuery = { "bool": { "should": [{ "match_phrase": keyObj }], "minimum_should_match": 1 } }
  if (typeof (inputObj) !== 'undefined') {
    inputObj.map(eachJSON => {
      let keys = Object.keys(eachJSON)
      arrChild = []
      console.log(keys)

      let child = { "bool": { "filter": arrChild } }
      keys.map(eachKey => {
        let obj = {}
        obj[eachKey] = eachJSON[eachKey]

        let oneAttribute = { "bool": { "should": [{ "match_phrase": obj }], "minimum_should_match": 1 } }
        arrChild.push(oneAttribute)

      })
      arrGrandChild.push(child)

    })
  }
  arrParent.push(headerQuery)
  arrParent.push(grandChild)
  console.log("arrParent", JSON.stringify(parentQuery))
  return JSON.stringify(parentQuery)

}




module.exports = {
  queryIndexWithKeyAndInput,
  getESQueryForOrder,
  getESQueryForChild
}
