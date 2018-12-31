const Line = 
{
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
}

export { Line as default }