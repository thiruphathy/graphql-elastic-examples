let input = "{ \"orderLines\":[ { \"lineSeqNo\": \"1.1\", \"itemId\": \"00750222216335\" }, { \"lineSeqNo\": \"4.1\", \"itemId\": \"00084802400005\" } ] }";
let input1 = "{ \"orderLines\":[  ] }";


console.log(input);
var contact = JSON.parse(input);
var contact1 = JSON.parse(input1);
var qry;
console.log(contact.orderLines[1].itemId);
if (contact.orderLines[0] == null)
    console.log("array is empty")
else {
    console.log("array is not empty")
    for (i in contact.orderLines) {
        let test = contact.orderLines[i];
        console.log(test)

        for (var key in test) {
            console.log(key + ' : ' + test[key]);
        }

    } 