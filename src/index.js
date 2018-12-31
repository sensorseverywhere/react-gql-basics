import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Story from './resolvers/Story'
import Line from './resolvers/Line'
import Card from './resolvers/Card'

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Story,
        Line,
        Card
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})