require('dotenv').config()
import { GraphQLServer } from 'graphql-yoga'
import { resolvers, typeDefs } from './graphql-utils'

const server = new GraphQLServer({
        typeDefs: typeDefs, 
        resolvers, 
        context: req => ({
            ...req,
            key: process.env.API_KEY
        }),
})

const options = {
    port: 8001,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}
  
server.start(options, ({ port }) => console.log(`> Server started, listening on port ${port} for incoming requests.`))
