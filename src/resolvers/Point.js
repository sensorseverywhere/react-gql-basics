const Point = 
{
    author(parent, args, { db }, info) {
        return db.users.find((user) => {
            return user.id === parent.author
        })
    },  
    story(parent, args, { db }, info) {
        return db.story.filter((s) => {
            return s.point === parent.id
        })
    },
    card(parent, args, { db }, info) {
        return db.cards.filter((c) => {
            return c.point === parent.id
        })
    },
    line(parent, args, { db }, info) {
        return db.lines.filter((line) => {
            return line.points === parent.id
        })
    }
}

export { Point as default }