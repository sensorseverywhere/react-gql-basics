const Card = 
{
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

export { Card as default }