import dotenv from 'dotenv'
dotenv.config()

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServer } from '@apollo/server'
import express, { Express } from 'express'
import { json } from 'body-parser'
import cors from 'cors'
import http from 'http'

import { RefreshToken as TokenModel } from './models/refreshToken'
import { User as UserModel } from './models/user'
import { Move as MoveModel } from './models/move'
import { Mutation } from './resolvers/Mutation'
import { typeDefs } from './schemas/typeDefs'
import TokensAPI from './dataSources/Tokens'
import MovesAPI from './dataSources/Moves'
import UsersAPI from './dataSources/Users'
import { Query } from './resolvers/Query'
import connectDB from './config/db'
import { validateAccessToken } from './auth/jwt'

export interface AppContext {
  token?: string | undefined
  dataSources?: {
    movesAPI: MovesAPI
    tokensAPI: TokensAPI
    usersAPI: UsersAPI
  }
}

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
        // const token = req.headers.authorization || ""
        // const headers = req.headers["authorization"]
        // const token = headers?.split(" ")[1]
        const token = req.headers.token
        let accessToken
        let refreshToken
        let field = req.headers['x-access-token']
        let id: string | null

        console.log(`field is: ${field}`)

        // In case null is 'null', e.g. string
        if (typeof field === 'string') {
          const token = req.headers['x-access-token']
          // @ts-ignore
          accessToken = token.replace(/^null$/, '')
        }

        field = req.headers['x-refresh-token']
        if (typeof field === 'string') {
          // @ts-ignore
          refreshToken = req.headers['x-access-token']?.replace(/^null$/, '')
        }

        if (accessToken) {
          const decodedAccessToken = validateAccessToken(accessToken)
          // id = decodedAccessToken?.user?.id
        }

        const { cache } = server
        return {
          token,
          dataSources: {
            movesAPI: new MovesAPI({ collection: MoveModel, cache }),
            tokensAPI: new TokensAPI({ collection: TokenModel, cache }),
            usersAPI: new UsersAPI({ collection: UserModel, cache }),
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
