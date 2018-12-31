const User = 
{
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
}


export { User as default }