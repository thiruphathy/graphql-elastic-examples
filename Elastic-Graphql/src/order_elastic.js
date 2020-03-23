const elasticSearchSchema = require('./elastic.schema');
const {makeExecutableSchema} = require('graphql-tools');
const {ElasticSearchClient} = require('./es-search');

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Quotes {
    quote: String
    author: String 
  }

  type Query {
    quotes: [Quotes]
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    quotes: () => new Promise((resolve, reject) => {
        ElasticSearchClient({...elasticSearchSchema})
        .then(r => {
            console.log(r.body.hits.hits);
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