import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID
let users = [
    {
        id: '1',
        name: 'Wade',
        email: 'wade@wade.com',
        type: 'author',
        isMember: true
    },
    {
        id: '2',
        name: 'Soph',
        email: 'soph@soph.com',
        type: 'subscriber',
        isMember: false
    }, 
    {
        id: '3',
        name: 'Grace',
        email: 'youngest@child.com',
        type: 'author',
        isMember: true
    },
    {
        id: '4',
        name: 'Camille',
        email: 'eldest@child.com',
        type: 'subscriber',
        isMember: true
    }
]

let stories = [
    {
        id: '1',
        title: 'My first piece of content',
        body: 'Here is a short story',
        type: 'Short Story',
        author: '1',
        published: false
    },
    {
        id: '2',
        title: 'My second piece of content',
        body: 'Here is a novel',
        type: 'Novel',
        author: '2',
        published: true
    },
    {
        id: '3',
        title: 'My third piece of content',
        body: 'Here is some content',
        type: 'Comp',
        author: '1',
        published: true
    }
]

let lines = [
    {
        id: '1',
        story: '2',
        name: 'main',
        description: 'The main story line',
        colour: 'black',
        author: '1'
    },
    {
        id: '2',
        story: '1',
        name: 'Jelly',
        description: 'Jelly\'s story arc',
        colour: 'yellow',
        author: '1'
    },
    {
        id: '3',
        story: '1',
        name: 'Anami',
        description: 'Anami\'s story arc',
        colour: 'red',
        author: '1'
    }, 
    { 
        id: '4',
        story: '2',
        name: 'Boo',
        description: 'Boo\'s story arc',
        colour: 'blue',
        author: '1'
    }

]


// Type definitions (schema)
const typeDefs = `
    type Query {
        user: User!
        users(query: String): [User!]!
        stories(query: String): [Story!]!
        lines(query: String): [Line!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createStory(data: CreateStoryInput): Story!
        deleteStory(id: ID!): Story!
        createLine(data: CreateLineInput): Line!
        deleteLine(id: ID!): Line!
    }

    input CreateUserInput {
        name: String!,
        email: String!,
        type: String!
    }

     input CreateStoryInput {
        title: String!,
        body: String!,
        type: String!,
        author: ID!,
        published: Boolean!
    }

    input CreateLineInput {
        name: String!,
        description: String!, 
        author: ID!, 
        story: ID!,
        colour: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        type: String!
        stories: [Story!]!
        lines: [Line!]!
        subscribers: Int!
        isMember: Boolean!
    }

    type Story {
        id: ID!
        title: String!
        body: String!
        type: String!
        author: User!
        lines: [Line!]!
        published: Boolean
    }

    type Line {
        id: ID!
        name: String!
        description: String!
        author: User!
        colour: String!
        story: [Story!]
    }

    type Card {
        id: ID!
        title: String!
        text: String!
        type: String!
        author: ID!
        story: ID!
        line: ID
    }

`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {

            if(!args.query) {
                return users
            }
 
            return users.filter((user) => {
                 return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
     
        },
        stories(parent, args, ctx, info) {
            if(!args.query) {
                return stories
            }

            return stories.filter((story) => {
                const titleMatch = story.title.toLowerCase().includes(args.query.toLowerCase())
                const bodyMatch = story.body.toLowerCase().includes(args.query.toLowerCase())
                const typeMatch = story.type.toLowerCase().includes(args.query.toLowerCase())
                return titleMatch || bodyMatch || typeMatch
            })
        },
        lines(parent, args, ctx, info) {
            if(!args.query) {
                return lines
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            
            if(emailTaken) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(), 
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if(userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1)

            stories = stories.filter((story) => {
                const match = story.author === args.id

                if(match) {
                    lines = lines.filter((line) => line.story !== story.id)
                }

                return !match
            })

            lines = lines.filter((line) => line.author !== args.id)

            return deletedUsers[0]
        },
        createStory(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }
            const story = {
                id: uuidv4(), 
                ...args.data
            }

            stories.push(story)

            return story
        },
        deleteStory(parent, args, ctx, info) {
            const storyIndex = stories.findIndex((story) => story.id === args.id)

            if(storyIndex === -1) {
                throw new Error('Story not found')
            }

            const deletedStory = stories.splice(storyIndex, 1)

            lines = lines.filter((line) => line.story !== args.id)

            return deletedStory[0]
        },
        createLine(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const storyExists = stories.find((story) => story.id === args.data.story)
            
            if(!userExists) {
                throw new Error('User not found')
            }

            if(!storyExists) {
                throw new Error('Story not found')
            }

            const line = {
                id: uuidv4(),
                ...args.data
            }

            lines.push(line)

            return line
        }, 
        deleteLine(parent, args, ctx, info) {
            const lineIndex = lines.findIndex((line) => line.id === args.id)

            if(lineIndex === -1) {
                throw new Error('Line not found')
            }

            const deletedLine = lines.splice(lineIndex, 1)

            return deletedLine[0]

        }
    },
    Story: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        lines(parent, args, ctx, info) {
            return lines.filter((line) => {
                return line.id === parent.id
            })
        }

    }, 
    User: {
        stories(parent, args, ctx, info) {
            return stories.filter((story) => {
                return story.author === parent.id
            })
        },
        lines(parent, args, ctx, info) {
            return lines.filter((line) => {
                return line.author === parent.id
            })
        }
    },
    Line: {
        story(parent, args, ctx, info) {
            return story.filter((story) => {
                return story.id === parent.story
            })
        },
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})