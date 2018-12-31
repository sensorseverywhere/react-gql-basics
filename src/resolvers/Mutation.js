import uuidv4 from 'uuid/v4'

const Mutation =
{
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
}

export { Mutation as default }