var client = require('./Connection.js').esClient;

client.indices.delete({ index: 'gov' }, function (err, resp, status) {
    if (err) {
        console.log(err);
    } else {
        console.log(status)
        console.log("delete", resp);
    }
});