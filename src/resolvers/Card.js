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
    },
    points(parents, args, { db }, info) {
        return db.points.filter((point) => {
            return point.line === line.id
        })
    }

}

export { Card as default }