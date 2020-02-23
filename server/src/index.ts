import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {rootSchema} from './rootSchema';

const server = new ApolloServer({schema: rootSchema, tracing: true});

const app = express();
const path = '/graphql';

server.applyMiddleware({
  app, path
});

app.listen({port: 4000}, () =>
  console.log(`Server is up and running on port ${server.graphqlPath}`)
);
