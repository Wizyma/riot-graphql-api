require('dotenv').config()

import morgan from 'morgan'
import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from './graphql-utils'
import { getStaticFiles } from './helpers/utils'

const server = new GraphQLServer({
        typeDefs: './graphql-utils/schema/schema.graphql', 
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
if (process.env.DEV) {
    require("nodejs-dashboard")
    server.use(morgan('dev'))
}

server.start(options, ({ port }) => console.log(`> Server started, listening on port ${port} for incoming requests.`) || getStaticFiles())