require('dotenv').config();
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer, gql } from 'apollo-server-express';
// import { IResolvers } from 'graphql-tools';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

import { Query } from './resolvers/Query';
import { typeDefs } from './schemas/schema';

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.jtenkl6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const dbConnection = async () => {
  await mongoose.connect(URI, {})
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
    },
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/'
  });

  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();


dbConnection()
  .then(() => console.log('🎉 connected to database successfully'))
  .catch(error => console.error('dbConnection Error: ', error));
