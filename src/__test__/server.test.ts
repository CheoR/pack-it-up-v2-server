import { ApolloServer } from 'apollo-server-express'
import { gql } from 'apollo-server-express'
// For clarity in this example we included our typeDefs and resolvers above our test,
// but in a real world situation you'd be importing these in from different files
const typeDefs = gql`
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    // @ts-ignore
    hello: (_, { name }) => `Hello ${name}!`,
  },
}

it('returns hello with the provided name', async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const result = await testServer.executeOperation({
    query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
    variables: { name: 'world' },
  })

  expect(result.errors).toBeUndefined()
  expect(result.data?.hello).toBe('Hello world!')
})

// import { typeDefs } from '../schemas/typeDefs'
// import { Mutation } from '../resolvers/Mutation'
// import { Query } from '../resolvers/Query'

// it('returns 12 users', async () => {
//   const testServer = new ApolloServer({
//     typeDefs,
//     resolvers: {
//       Mutation,
//       Query,
//     },
//   })

//   // const result = await testServer.executeOperation({
//   //   query: `
//   //     query {
//   //       users {
//   //         _id
//   //         username
//   //       }
//   //     }
//   //   `,
//   // })

//   // expect(result.errors).toBeUndefined()
//   // expect(result.data?.getUsers).toBe(12)
//   expect(true).toBe(true)
// })

// // export {}
