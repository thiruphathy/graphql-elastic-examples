const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const {ApolloServer} = require('apollo-server-express');
const {ApiElasticSearchClient} = require('./es-search');
const madeExecutableSchema = require('./graphql');
const http = require('http');

const {gql, PubSub, withFilter } = require('apollo-server');

// PORT
const PORT = 9100;
const HTTPPORT = 9101;

const server = new ApolloServer({
  schema: madeExecutableSchema,
  playground: true,
  subscriptions:true
});


const pubsub = new PubSub();


function start(){
// TODO Use the BodyParser as a middleware
app.use(bodyParser.json());

// TODO Set port for the app to listen on
app.set('port', process.env.PORT || 3001);

// TODO Set path to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// TODO Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method");
  next();
});

// Define the `/search` route that should return elastic search results
// app.get('/search', ApiElasticSearchClient);

server.applyMiddleware({app});

app.listen(PORT, function () {
  console.log(`Express server listening on port :${PORT}${server.graphqlPath}`);
});

return app;
}


const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


httpServer.listen({ port:  HTTPPORT}, () => {
  console.log(`🚀 Server ready at http://localhost:${HTTPPORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${HTTPPORT}${server.subscriptionsPath}`);
});


module.exports ={
    start
}