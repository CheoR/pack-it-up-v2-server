require('dotenv').config();
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

import { Mutation } from './resolvers/Mutation';
import { Query } from './resolvers/Query';
import { typeDefs } from './schemas/schema';
import { db } from './data/db';

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
      Mutation,
    },
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: { db },
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
