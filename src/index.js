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
]

let lines = [
    {
        id: '1',
        story: '1',
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
        story: '2',
        name: 'Anami',
        description: 'Anami\'s story arc',
        colour: 'red',
        author: '2'
    }, 
    { 
        id: '4',
        story: '1',
        name: 'Boo',
        description: 'Boo\'s story arc',
        colour: 'blue',
        author: '1'
    }

]

let cards = [
    {
        id: '1',
        author: '1',
        story: '1',
        line: '1',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    },
    {
        id: '2',
        author: '2',
        story: '2',
        line: '3',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    },
    {
        id: '3',
        author: '1',
        story: '2',
        line: '3',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    }
]


// Type definitions (schema)
const typeDefs = `
    type Query {
        user: User!
        users(query: String): [User!]!
        stories(query: String): [Story!]!
        lines(query: String): [Line!]!
        cards(query: String): [Card!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createStory(data: CreateStoryInput): Story!
        deleteStory(id: ID!): Story!
        createLine(data: CreateLineInput): Line!
        deleteLine(id: ID!): Line!
        createCard(data: CreateCardInput): Card!
        deleteCard(id: ID!): Card!
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

    input CreateCardInput {
        title: String!
        text: String!
        type: String!
        author: ID!
        story: ID!
        lines: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        type: String!
        stories: [Story!]!
        lines: [Line!]!
        cards: [Card!]!
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
        stories: Story!
        cards: [Card!]
        colour: String!
    }

    type Card {
        id: ID!
        title: String!
        text: String!
        type: String!
        author: User!
        stories: Story!
        lines: Line!
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
        },
        cards(parent, args, ctx, info) {
            if(!args.query) {
                return cards
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
                //check to see if there is an id match between the story and the author
                const match = story.author === args.id

                if(match) {
                    lines = lines.filter((line) => line.story !== story.id)
                }

                return !match
            })

            lines = lines.filter((line) => {
                const lineMatch = line.author === args.id

                if(lineMatch) {
                    cards = cards.filter((card) => card.line !== line.id)
                }

                return !lineMatch
            })

            cards = cards.filter((card) => card.author !== args.id)
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

            cards = cards.filter((card) => card.story !== args.id)
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

            cards = cards.filter((card) => card.lines !== args.id)

            return deletedLine[0]

        },
        createCard(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const storyExists = stories.find((story) => story.id === args.data.story)
            const lineExists = lines.find((line) => line.id === args.data.line)
            
            if(!userExists) {
                throw new Error('User not found')
            }

            if(!storyExists) {
                throw new Error('Story not found')
            }

            if(!lineExists) {
                throw new Error('Line not found')
            }

            const card = {
                id: uuidv4(),
                ...args.data
            }

            cards.push(card);

            return card
        },
        deleteCard(parent, args, ctx, info) {
            const cardIndex = cards.findIndex((card) => card.id === args.id)

            if(cardIndex === -1) {
                throw new Error('Line not found')
            }

            const deletedCard = cards.splice(cardIndex, 1)

            return deletedCard[0]

        },
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
        }, 
        cards(parent, args, ctx, info) {
            return cards.filter((card) => {
                return card.author === parent.id
            })
        }
    },
    Line: {
        stories(parent, args, ctx, info) {
            return stories.find((story) => {
                return story.id === parent.story
            })
        },
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        cards(parent, args, ctx, info) {
            return cards.filter((card) => {
                return card.line === parent.id
            })
        }
    },
    Card: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        stories(parent, args, ctx, info) {
            return stories.find((story) => {
                return story.id === parent.story
            })
        },
        lines(parent, args, ctx, info) {
            return lines.find((line) => {
                return line.id === parent.line
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