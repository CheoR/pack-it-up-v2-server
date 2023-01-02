import dotenv from 'dotenv'
dotenv.config()

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServer } from '@apollo/server'
import { json } from 'body-parser'
import express from 'express'
import cors from 'cors'
import http from 'http'

import { User as UserModel } from './models/user'
import { Mutation } from './resolvers/Mutation'
import { typeDefs } from './schemas/typeDefs'
import { Query } from './resolvers/Query'
import Users from './dataSources/Users'
import connectDB from './config/db'


interface AppContextValue {
  token?: string
  dataSources: {
    users: Users
  }
}

interface ContextParams {
  req: express.Request
  res?: express.Request
}

const DEFAULT_PORT = 4000

async function startApolloServer() {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer<AppContextValue>({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async <ContextParams>({ req }) => {
        return {
          token: req.headers.token,
          dataSources: {
            users: new Users(UserModel),
          },
        }
      },
    }),
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || DEFAULT_PORT }, resolve),
  )

  console.log(`🚀 Server ready at ${process.env.PORT || DEFAULT_PORT}:
    ${process.env.PORT || DEFAULT_PORT}`)
}

startApolloServer()
connectDB()
