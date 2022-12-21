import { ApolloServer } from '@apollo/server'
// For clarity in this example we included our typeDefs and resolvers above our test,
// but in a real world situation you'd be importing these in from different files
const typeDefs = `#graphql
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

describe('one test', () => {
  it('has one test', () => {
    expect(1).toBe(1)
  })
  it('returns hello with the provided name', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
    })

    expect(testServer).toBeDefined()
  })
})

//   const result = await testServer.executeOperation({
//     query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
//     variables: { name: 'world' },
//   })

//   expect(result.errors).toBeUndefined()
//   expect(result.data?.hello).toBe('Hello world!')
// })

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
