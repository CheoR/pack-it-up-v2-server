import { ApolloServerErrorCode } from '@apollo/server/errors'
import jwt from 'jsonwebtoken'

type Context = {
  req: {
    headers: {
      authorization: string
    }
  }
}

export const auth = (context: Context) => {
  const authHeader = context.req.headers.authorization

  if (authHeader) {
    const token = authHeader.split('Bearer')[1]
    if (token) {
      try {
        const secret = process.env.JWT_SECRET as string
        const user = jwt.verify(token, secret)
        return user
      } catch (error) {
        throw ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      }
    }
    throw new Error('Authorization token must be "Bearer [token]"')
  }
  throw new Error('Athorization header not provided')
}
