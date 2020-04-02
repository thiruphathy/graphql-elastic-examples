const elasticSearchSchema = require('./elastic.schema');
const {
	makeExecutableSchema
} = require('graphql-tools');
const {
  ElasticSearchClient,
  ElasticSearchClientAsync
} = require('./es-search');

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Orders {
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
     searchByQuery(inQuery : String!): [Orders]
    searchByOrder(orderNumber : String!, enterpriseKey : String): [Orders]
     searchByEmailID(emailID : String!): [Orders]
  }
`;


// The root provides a resolver function for each API endpoint
const resolvers = {

	Query: {

		searchByQuery: (parent, args, context, info) => new Promise((resolve, reject) => {
			console.log(args);
			var str = '{ "name": "John Doe", "age": 42 }';
			var obj1 = JSON.parse(str);
			console.log(obj1);
			var obj2 = JSON.parse(JSON.stringify(args));
			console.log(obj2);

		}),
		searchByOrder: (parent, args, context, info) => new Promise((resolve, reject) => {
			console.log(args);

			ElasticSearchClient("order_pqa_v1", { ...elasticSearchSchema.queryOrderNumber(args.orderNumber)
				})
				.then(r => {

					let _source = r.body.hits.hits;
					_source.map((item, i) => _source[i] = item._source);

					return _source;
					// resolve(_source);
				}).then(_orderSource => {
          let orderHeaderKey = _orderSource[0].orderHeaderKey;
          return ElasticSearchClient("orderline_pqa_v1", { ...elasticSearchSchema.queryOrderHeaderKey(orderHeaderKey)
            })
            .then(
              result => {
                let _olsource = result.body.hits.hits;
                _olsource.map((item, i) => {
                  _olsource[i] = item._source
                });
                return {
                  "parent": _orderSource,
                  "child": _olsource
                }

              }
            );
        }).then(olres => {
          olres.parent[0].orderlines = olres.child;
          return olres.parent;
        })
        .then(_orderSource => {
          let orderHeaderKey = _orderSource[0].orderHeaderKey;
          return ElasticSearchClient("shipment_pqa_v1", { ...elasticSearchSchema.queryOrderHeaderKey(orderHeaderKey)
            })
            .then(
              result => {
                let _shipsource = result.body.hits.hits;
                _shipsource.map((item, i) => {
                _shipsource[i] = item._source
                var shipmentKey = item._source.shipmentKey;
                const containerFuntion = async () => await ElasticSearchClientAsync("shipment_container_pqa_v1", { ...elasticSearchSchema.queryShipmentKey(shipmentKey)
                    });
                      // let _containerSource = res.body.hits.hits;
                      //     _containerSource.map((item, i) => {
                      //         _containerSource[i] = item._source
                      //       }
                      //     );
                      //     _shipsource[i].containers= _containerSource
                      //     console.log("res-res-1:", _shipsource[i]);
                      //     temp_containerSource=_containerSource;
                      //     return _shipsource[i];
                          // return temp_containerSource=_containerSource;
                      let containerResult = containerFuntion().resolve;
                      console.log("temp_containerSource-1:", containerResult);  
                  }
                );
                console.log("shipres-0: child", _shipsource[0].containers);
                return {
                  "parent": _orderSource,
                  "child": _shipsource
                }
                });
               

        }).then(shipres => {
          // console.log("shipres:", shipres);
          console.log("shipres-1: child", shipres.child);
          shipres.parent[0].shipments = shipres.child;
          resolve(shipres.parent);
        });
    }),


		searchByEmailID: (parent, args, context, info) => new Promise((resolve, reject) => {
			console.log(args.emailID, args.enterpriseKey);
			ElasticSearchClient("order_pqa_v1", { ...elasticSearchSchema
				})
				.then(r => {
					// console.log(r.body.hits.hits);
					let _source = r.body.hits.hits;
					_source.map((item, i) => _source[i] = item._source);
					resolve(_source);
				});
		})

	}
};

module.exports = makeExecutableSchema({
	"typeDefs": [typeDefs],
	"resolvers": resolvers
});