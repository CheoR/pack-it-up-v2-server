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
import {
  setTokens,
  validateAccessToken,
  validateRefreshToken,
} from './auth/jwt'

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
        let accessToken = req.headers['x-access-token']
        let refreshToken = req.headers['x-refresh-token']
        let user_id: string | null = null

        // In case null is 'null', e.g. string
        if (typeof accessToken === 'string') {
          // @ts-ignore
          accessToken = accessToken.replace(/^null$/, '')
        }

        if (typeof refreshToken === 'string') {
          // @ts-ignore
          refreshToken = refreshToken.replace(/^null$/, '')
        }

        if (accessToken && typeof accessToken === 'string') {
          const decodedAccessToken = await validateAccessToken(accessToken)
          // @ts-ignore
          user_id = decodedAccessToken?.user_id
        }

        if (!user_id && refreshToken && typeof refreshToken === 'string') {
          // access token possibily expired
          // @ts-ignore
          const tokenUser = await validateRefreshToken(refreshToken)

          if (tokenUser) {
            // refresh tokens
            // pass back to client through headers
            // so client can refresh without a separate GraphQL query
            const { accessToken, refreshToken } = setTokens({
              // @ts-ignore
              id: tokenUser.user_id,
              // @ts-ignore
              email: tokenUser.email,
            })

            // TODO: update db tokens to include new refresh token
            console.log(`refresh token is now: \n${refreshToken}`)
            res.set('x-access-token', accessToken)
            res.set('x-refresh-token', refreshToken)
        }
        } else
          console.info(
            `Invalid/expired access token presented but refreshToken null or missing!`,
          )

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
