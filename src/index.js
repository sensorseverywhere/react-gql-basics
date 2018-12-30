import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, { db }, info) {

            if(!args.query) {
                return db.users
            }
 
            return db.users.filter((user) => {
                 return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
     
        },
        stories(parent, args, { db }, info) {
            if(!args.query) {
                return db.stories
            }

            return db.stories.filter((story) => {
                const titleMatch = story.title.toLowerCase().includes(args.query.toLowerCase())
                const bodyMatch = story.body.toLowerCase().includes(args.query.toLowerCase())
                const typeMatch = story.type.toLowerCase().includes(args.query.toLowerCase())
                return titleMatch || bodyMatch || typeMatch
            })
        },
        lines(parent, args, { db }, info) {
            if(!args.query) {
                return db.lines
            }
        },
        cards(parent, args, { db }, info) {
            if(!args.query) {
                return db.cards
            }
        }
    },
    Mutation: {
        createUser(parent, args, { db }, info) {
            const emailTaken = db.users.some((user) => user.email === args.data.email)
            
            if(emailTaken) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(), 
                ...args.data
            }

            db.users.push(user)

            return user
        },
        deleteUser(parent, args, { db }, info) {
            const userIndex = db.users.findIndex((user) => user.id === args.id)

            if(userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = db.users.splice(userIndex, 1)

            db.stories = db.stories.filter((story) => {
                //check to see if there is an id match between the story and the author
                const match = story.author === args.id

                if(match) {
                    db.lines = db.lines.filter((line) => line.story !== story.id)
                }

                return !match
            })

            db.lines = db.lines.filter((line) => {
                const lineMatch = line.author === args.id

                if(lineMatch) {
                    db.cards = db.cards.filter((card) => card.line !== line.id)
                }

                return !lineMatch
            })

            db.cards = db.cards.filter((card) => card.author !== args.id)
            db.lines = db.lines.filter((line) => line.author !== args.id)

            return deletedUsers[0]
        },
        createStory(parent, args, { db }, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }
            const story = {
                id: uuidv4(), 
                ...args.data
            }

            db.stories.push(story)

            return story
        },
        deleteStory(parent, args, { db }, info) {
            const storyIndex = db.stories.findIndex((story) => story.id === args.id)

            if(storyIndex === -1) {
                throw new Error('Story not found')
            }

            const deletedStory = db.stories.splice(storyIndex, 1)

            db.cards = db.cards.filter((card) => card.story !== args.id)
            db.lines = db.lines.filter((line) => line.story !== args.id)

            return deletedStory[0]
        },
        createLine(parent, args, { db }, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)
            const storyExists = db.stories.find((story) => story.id === args.data.story)
            
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

            db.lines.push(line)

            return line
        }, 
        deleteLine(parent, args, { db }, info) {
            const lineIndex = db.lines.findIndex((line) => line.id === args.id)

            if(lineIndex === -1) {
                throw new Error('Line not found')
            }

            const deletedLine = db.lines.splice(lineIndex, 1)

            db.cards = db.cards.filter((card) => card.lines !== args.id)

            return deletedLine[0]

        },
        createCard(parent, args, { db }, info) {
            const userExists = db.users.some((user) => user.id === args.data.author)
            const storyExists = db.stories.find((story) => story.id === args.data.story)
            const lineExists = db.lines.filter((line) => line.id === args.data.line)
            
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

            db.cards.push(card);

            return card
        },
        deleteCard(parent, args, { db }, info) {
            const cardIndex = db.cards.findIndex((card) => card.id === args.id)

            if(cardIndex === -1) {
                throw new Error('Card not found')
            }

            const deletedCard = db.cards.splice(cardIndex, 1)

            return deletedCard[0]

        },
    },
    Story: {
        author(parent, args, { db }, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        lines(parent, args, { db }, info) {
            return db.lines.filter((line) => {
                return line.id === parent.id
            })
        }

    }, 
    User: {
        stories(parent, args, { db }, info) {
            return db.stories.filter((story) => {
                return story.author === parent.id
            })
        },
        lines(parent, args, { db }, info) {
            return db.lines.filter((line) => {
                return line.author === parent.id
            })
        }, 
        cards(parent, args, { db }, info) {
            return db.cards.filter((card) => {
                return card.author === parent.id
            })
        }
    },
    Line: {
        stories(parent, args, { db }, info) {
            return db.stories.find((story) => {
                return story.id === parent.story
            })
        },
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        cards(parent, args, { db }, info) {
            return db.cards.filter((card) => {
                return card.line === parent.id
            })
        }
    },
    Card: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        stories(parent, args, { db }, info) {
            return db.stories.find((story) => {
                return story.id === parent.story
            })
        },
        line(parent, args, { db }, info) {
            return db.line.find((line) => {
                return line.id === parent.line
            })
        }

    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})