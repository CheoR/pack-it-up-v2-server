require('dotenv').config();

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

import { db } from './data/db';
import Users from './dataSources/Users';
import {User as UserModel} from './models/user';
import { Query } from './resolvers/Query';
import { Mutation } from './resolvers/Mutation';
import { typeDefs } from './schemas/schema';

const URI = `${process.env.MONGO_URI}`;
console.log('server.ts\nURI: ', URI);
const dbConnection = async () => {
  await mongoose.connect(URI, {})
};

const dataSources = () => ({
  // @ts-ignore
  users: new Users(UserModel),
});

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
    dataSources,
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
