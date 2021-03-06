const elasticSearchSchema = require('./elastic.schema');
const {gql, PubSub, withFilter } = require('apollo-server');
const { KafkaPubSub } = require('graphql-kafka-subscriptions');

const {
	makeExecutableSchema
} = require('graphql-tools');


const {
  ElasticSearchClient,
  ElasticSearchClientAsync
} = require('./es-search');

const pubsub = new PubSub();

const kafkaPubSubIn = new KafkaPubSub({
  topic: 'gqlinput',
  host: 'localhost',
  port: '9092',
   
})

const kafkaPubSubOut = new KafkaPubSub({
  topic: 'gqloutput',
  host: 'localhost',
  port: '9092',
   
})

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Order {
    orderNumber:String,
    orderHeaderKey: String,
    customerFirstName: String,
    totalAdjustmentAmount:Int,
    foreignRFC: String,
    documentType: String,
    holdFlag: String,
    paymentRuleId: String,
    totalAmount: Float,
    cfdi: String,
    payAtStore: String,
    customerEmailId : String,
    nationalRFC : String,
    orderType : String,
    orderModifyPID : String,
    holdReasonCode : String,
    orderCreateTS : String,
    enterpriseKey : String,
    customerLastName : String,
    allocationRuleId : String,
    tax : Float,
    otherCharges : Float,
    customerZipCode : String,
    extnPaymentStatus : String,
    currency : String,
    originalTotalAmount : Float,
    sellerOrganizationCode : String,
    originalTax : Float,
    orderDate : String,
    orderModifyTS : String,
    entryType : String,
    customerPhoneNo : String,
    paymentStatus : String,
    billToKey : String,
    shipToKey : String,
 
    shippingAddress: Address,
    billingAddress: Address,

    orderlines: [OrderLine],
    payments: [Payment],
    shipments: [Shipment]


  }

  type Container {
    containerNo : String,
    containerHeight : Int,
    containerExtnStatus : String,
    containerExtnSize : String,
    containerType : String,
    trackingNo : String,
    shpContainerModifyTS : String,
    containerSCM :  String,
    shipmentContainerKey : String,
    containerGrossWeight : Float,
    rejectionReason : String,
    shpContainerCreateTS : String,
    containerWidth : Float,
    shpContainerModifyPID : String,
    containerLength : Float,
    actualWeight : Float,
    shipmentKey : String,
    containerNetWeight : Float,
    shipDate : String,
    containerDetails: [ContainerDetail]
  }

  type ContainerDetail {
    itemId : String,
    orderLineKey : String,
    quantity : Float,
    uom : String,
    containerDetailsKey : String,
    productClass : String,
    shipmentLineKey : String
  }

  type Shipment {
    orderNumber : String,
    deliveryMethod : String,
    enterpriseCode : String,
    tcNumber : String,
    shipmentModifyPID : String,
    shipmentType : String ,
    statusDate : String,
    scac : String,
    requestedShipmentDate : String,
    actualShipmentDate : String,
    shipmentTrackingNo : String,
    actualDeliveryDate : String,
    customerKeepFlag : String,
    shipmentModifyTS : String,
    shipVia :  String,
    shipmentNo : String,
    shipToAddressKey : String,
    shipmentCreateTS : String,
    documentType : String,
    receivingNode : String,
    sellerOrganizationCode : String,
    requestedDeliveryDate : String,
    orderHeaderKey : String,
    shipNodeKey : String,
    trNumber : String,
    status : String,
    shipmentKey : String,
    trackingURL : String,
    carrierServiceCode : String,
    shippingAddress:Address,
    shipmentLines: [ShipmentLine],
    containers: [Container]
  }

  
  type ShipmentLine {
    shipmentLineCreateTS : String,
    itemDescription : String,
    quantity : Float,
    productClass : String,
    originalQty : Float,
    itemId : String,
    orderLineKey : String,
    primeLineNo : Int,
    shipmentLineNo : Int,
    uom : String,
    shipmentLineModifyTS : String,
    shipmentLineModifyPID : String,
    shipmentLineKey : String
    }

  type Payment {
      paymentOption: String,
      totalRefundedAmount : Float,
      paymentType : String,
      displayCreditCardNo : String,
      paymentCreateTS : String,
      creditCardType : String,
      paymentModifyPID : String,
      displayDebitCardNo : String,
      displayOtherPaymentNo : String,
      totalCharged : Float,
      paymentModifyTS : String
    }

  type Address {
    addressLine1:String,
    addressLine2: String,
    addressLine3:String,
    addressLine4:String,
    addressLine5: String,
    eveningPhone: String,
    firstName:String,
    lastName: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    mobilePhone: String,
    emailId: String
  }

  type OrderLine {
    carrierId:String,
    orderLineKey: String,
    lineType : String,
    mpCommission : String,
    holdFlag : String,
    kitCode: String,
    orderLineCreateTS : String,
    orderLineModifyPID : String,
    productClass : String,
    atgBoxNumber : String,
    uom : String,
    holdReasonCode : String,
    chainedFromOrderHeaderKey : String,
    tax : Float,
    itemWeightUOM : String,
    atgBoxHeight : Float,
    atgBoxWeight : Float
    itemGTIN: String,
    orderedQty : Int,
    timeSlotTo : String,
    mpOrderNo: String,
    itemDescription : String,
    actualPricingQuantity : Int,
    carrierBoxId : String,
    storePickStartTime : String,
    isBulkBundle : String,
    chainedFromOrderLineKey : String,
    lineSeqNo : String,
    invoicedLineTotal : Float,
    upcCode : String,
    invoicedExtendedPrice : Float,
    itemId : String,
    derivedFromOrderLineKey : String,
    unitPriceWithTax : Float,
    orderLineModifyTS : String
  }


  type Query  {
    getOrders(inQuery : String!): [Order]
    searchByOrder(orderNumber : String!, enterpriseKey : String): [Order]
    searchByEmailID(emailID : String!): [Order]
  }


  type Mutation {
    updateOrder(orderNumber : String!, enterpriseKey : String): [Order]
    triggerOrderMod(orderNumber : String!, enterpriseKey : String): [Order]
  } 
  
  type Subscription {
    orderModSub(orderNumber : String!, enterpriseKey : String): [Order]
    orderModSubViaKafka(orderNumber : String!, enterpriseKey : String): [Order]
  }

`;

// The root provides a resolver function for each API endpoint
const resolvers = {


	Query: {

		getOrders: (parent, args, context, info) => new Promise((resolve, reject) => {
			console.log(args);
			var str = '{ "name": "John Doe", "age": 42 }';
			var obj1 = JSON.parse(str);
			console.log(obj1);
			var obj2 = JSON.parse(JSON.stringify(args));
			console.log(obj2);

    }),
    

    

		searchByOrder: (parent, args, context, info) => 
      (async () => {
        const orderIndex = await ElasticSearchClient('order_pqa_v1', { ...elasticSearchSchema.queryOrderNumber(args.orderNumber)});

        let _source = orderIndex.body.hits.hits;
        _source.map((item, i) => {
          _source[i] = item._source
        });
	      console.log("_source:" ,_source[0].orderHeaderKey);

        _source[0].orderlines = await getOrderLines(_source[0].orderHeaderKey);

        _source[0].shipments = await getShipments(_source[0].orderHeaderKey);

        return new Promise(async (resolve) => {
          resolve(_source);
        });

      })(),


		searchByEmailID: (parent, args, context, info) => new Promise((resolve, reject) => {
			console.log(args.emailID, args.enterpriseKey);
			ElasticSearchClient("order_pqa_v1", { ...elasticSearchSchema
				})
				.then(r => {
					// console.log(r.body.hits.hits);
					var _source = r.body.hits.hits;
					_source.map((item, i) => _source[i] = item._source);
					resolve(_source);
				});
		})
  } ,
  
  Mutation: {
    updateOrder: (parent, args, context, info) => 
      (async () => {
        const orderIndex = await ElasticSearchClient('order_pqa_v1', { ...elasticSearchSchema.queryOrderNumber(args.orderNumber)});

        let _source = orderIndex.body.hits.hits;
        _source.map((item, i) => {
          _source[i] = item._source
        });
	      console.log("_source:" ,_source[0].orderHeaderKey);

        _source[0].orderlines = await getOrderLines(_source[0].orderHeaderKey);

        _source[0].shipments = await getShipments(_source[0].orderHeaderKey);


        pubsub.publish("orderModSub",  {orderModSub:_source});
        // kafkaPubSubOut.publish({orderModSubViaKafka:_source});

        return new Promise(async (resolve) => {
          resolve(_source);
        });

      })(),
      triggerOrderMod: (parent, args, context, info) => 
      (async () => {
        const orderIndex = await ElasticSearchClient('order_pqa_v1', { ...elasticSearchSchema.queryOrderNumber(args.orderNumber)});

        let _source = orderIndex.body.hits.hits;
        _source.map((item, i) => {
          _source[i] = item._source
        });
	      console.log("_source:" ,_source[0].orderHeaderKey);
 
        _source[0].orderlines = await getOrderLines(_source[0].orderHeaderKey);

        _source[0].shipments = await getShipments(_source[0].orderHeaderKey);

        pubsub.publish("orderModSub",  {orderModSub:_source});
        // kafkaPubSubOut.publish({orderModSubViaKafka:_source});

      })(),
  },

  Subscription: {
    orderModSub: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("orderModSub"),
        (parent, args, context, info) => {
          console.log("args.orderNumber:" ,args.orderNumber);
          if(parent.orderModSub[0].orderNumber==args.orderNumber){
            return true;
          }else {
            return false
          }
        }
      ),
    },
    orderModSubViaKafka:{ 
      resolve: (payload) => {
        console.log('PAYLOAD1', payload);
         return new Promise(async (resolve) => { 
          let orderData = await getOrderData(payload.orderNumber) 
          // console.log('orderData', orderData);
          // kafkaPubSubOut.publish({orderModSubViaKafka:orderData});
          resolve(orderData);
        });
      },
      subscribe: withFilter(
        () => kafkaPubSubIn.asyncIterator('gqlinput'),
        (parent, args, context, info) => {
          console.log("args.orderNumber:" ,args.orderNumber);
          console.log("parent.orderNumber:" ,parent.orderNumber);
          if(parent.orderNumber==args.orderNumber){
            return true;
          }else {
            return false
          }
        }
      )
    }
  }
};
 

async function getOrderData(orderNumber){
  return new Promise(async (resolve) => {
      // for (element of elements) {
    try {
        const orderIndex = await ElasticSearchClient('order_pqa_v1', { ...elasticSearchSchema.queryOrderNumber(orderNumber)});

        let _source = orderIndex.body.hits.hits;
        _source.map((item, i) => {
          _source[i] = item._source
        });
        console.log("_source:" ,_source[0].orderHeaderKey);

        _source[0].orderlines = await getOrderLines(_source[0].orderHeaderKey);

        _source[0].shipments = await getShipments(_source[0].orderHeaderKey);
        
        resolve(_source);
      } catch (err) {
        console.error("An error occurred while getting the books mapping:");
        console.error(err);
      }
  // }
  // resolve(elements);
  });
}

async function getOrderLines(orderHeaderKey) {
  return new Promise(async (resolve) => {
    // for (element of elements) {
      try {
        console.log("printting the orderHeaderKey" + orderHeaderKey);
        const orderLinesIndex = await ElasticSearchClient("orderline_pqa_v1", { ...elasticSearchSchema.queryOLIndex(orderHeaderKey) })

        var _source1 = orderLinesIndex.body.hits.hits;
        _source1.map((item, i) => {
          _source1[i] = item._source
        });
        //call  the other async function
        // element.authorBooks = await doPublication(_source1);
        resolve(_source1);
      } catch (err) {
        console.error("An error occurred while getting the books mapping:");
        console.error(err);
      }
    // }
    // resolve(elements);
  });
}


async function getContainers(shipments) {
  return new Promise(async (resolve) => {
    for (element of shipments) {
      try {
        console.log("printting the shipmentKey" + element.shipmentKey);
        const containersIndex = await ElasticSearchClientAsync("shipment_container_pqa_v1", { ...elasticSearchSchema.queryShipmentKey(element.shipmentKey) })

        var _source1 = containersIndex.body.hits.hits;
        _source1.map((item, i) => {
          _source1[i] = item._source
        });
        //call  the other async function
        element.containers = _source1;
        // resolve(_source1);
      } catch (err) {
        console.error("An error occurred while getting the books mapping:");
        console.error(err);
      }
    }
    resolve(shipments);
  });
}

async function getShipments(orderHeaderKey) {
  return new Promise(async (resolve) => {
    // for (element of elements) {
      try {
        console.log("printting the orderHeaderKey" + orderHeaderKey);
        const shipmentsIndex = await ElasticSearchClient("shipment_pqa_v1", { ...elasticSearchSchema.queryOrderHeaderKey(orderHeaderKey) })

        var _source1 = shipmentsIndex.body.hits.hits;
        _source1.map((item, i) => {
          _source1[i] = item._source
        });

        _source1 = await getContainers(_source1)

        resolve(_source1);
      } catch (err) {
        console.error("An error occurred while getting the books mapping:");
        console.error(err);
      }
    // }
    // resolve(elements);
  });
}


module.exports = makeExecutableSchema({
	"typeDefs": [typeDefs],
  "resolvers": resolvers,
});