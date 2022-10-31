import { AuthenticationError } from 'apollo-server-core'
import jwt from 'jsonwebtoken'

// TODO: replace any
// @ts-ignore: Make type
export const auth = (context: any) => {
  const authHeader = context.req.headers.authorization

  if (authHeader) {
    const token = authHeader.split('Bearer')[1]

    if (token) {
      try {
        const user = jwt.verify(token, 'UNSAFE_STRING')
        return user
      } catch (error) {
        throw new AuthenticationError('Invalid/Expired Token')
      }
    }
    throw new Error('Authorization token must be "Bearer [token]"')
  }
  throw new Error('Athorization header not provided')
}
