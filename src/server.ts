import dotenv from 'dotenv'
dotenv.config()

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServer } from '@apollo/server'
import { json } from 'body-parser'
import express, { Express } from 'express'
import cors from 'cors'
import http from 'http'

import { User as UserModel } from './models/user'
import { Move as MoveMOdel } from './models/move'
import { Mutation } from './resolvers/Mutation'
import { typeDefs } from './schemas/typeDefs'
import { Query } from './resolvers/Query'
import MovesAPI from './dataSources/Moves'
import UsersAPI from './dataSources/Users'
import connectDB from './config/db'

export interface AppContext {
  token?: string | undefined
  dataSources?: {
    usersAPI: UsersAPI
    movesAPI: MovesAPI
  }
}

// interface ContextParams {
//   req: express.Request
//   res?: express.Request
// }

const DEFAULT_PORT = 4000

async function startApolloServer() {
  const app: Express = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer<AppContext>({
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
      context: async ({ req }) => {
        const token = req.headers.token
        const { cache } = server
        return {
          token,
          dataSources: {
            usersAPI: new UsersAPI({ collection: UserModel, cache }),
            movesAPI: new MovesAPI({ collection: MoveMOdel, cache }),
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
