const elasticSearchSchema = require('./elastic.schema');
const {makeExecutableSchema} = require('graphql-tools');
const {ElasticSearchClient} = require('./es-search');

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
    billingAddress: Address

    orderlines: [OrderLine]
    payments: [Payment]

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
    searchByOrder(orderNumber : String, enterpriseKey : String): [Orders]
    searchByEmailID(emailID : String): [Orders]
  }
`;
    
// The root provides a resolver function for each API endpoint
const resolvers = {

  Query: {

    
    searchByOrder: (parent, args, context, info) => new Promise((resolve, reject) => {
      console.log(args.orderNumber, args.enterpriseKey);
        ElasticSearchClient("order_pqa_v1",{...elasticSearchSchema.queryOrderNumber(args.orderNumber)})
        .then(r => {

          let _source = r.body.hits.hits;
          _source.map((item, i) => _source[i] = item._source);

          return _source;
          // resolve(_source);
        }).then (_orderSource => {
          let orderHeaderKey = _orderSource[0].orderHeaderKey;

          return ElasticSearchClient("orderline_pqa_v1",{...elasticSearchSchema.queryOrderHeaderKey(orderHeaderKey)})
          .then(
            
                result => {

              let _olsource = result.body.hits.hits;
              _olsource.map((item, i) => {
                
                  _olsource[i] = item._source
                }
              );
          
              return { "parent" : _orderSource,
                        "child": _olsource
                      }

            } 
          );
                     
          // resolve(_source);

        }).then (olres => {
          console.log("olres: parent" , olres.parent);
          console.log("olres: child" , olres.child);

          olres.parent[0].orderlines=olres.child;

          resolve(olres.parent);
        });
    }),


    searchByEmailID: (parent, args, context, info) => new Promise((resolve, reject) => {
      console.log(args.emailID, args.enterpriseKey);
        ElasticSearchClient("order_pqa_v1",{...elasticSearchSchema})
        .then(r => {
            // console.log(r.body.hits.hits);
          let _source = r.body.hits.hits;
              _source.map((item, i) => _source[i] = item._source);
          resolve(_source);
        });
    }),
     
  }
};

module.exports = makeExecutableSchema({
  "typeDefs": [typeDefs],
  "resolvers": resolvers
});