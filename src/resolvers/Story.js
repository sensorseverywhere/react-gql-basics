const Story = 
{
    author(parent, args, { db }, info){
        return db.users.find((user) => {
            return user.id === parent.author
        })
    },
    lines(parent, args, { db }, info) {
        return db.lines.filter((line) => {
            return line.story === parent.id
        })
    },
    cards(parent, args, { db }, info) {
        return db.cards.filter((card) => {
            return card.story === parent.id
        })
    },
    points(parent, args, { db }, info) {
        return db.points((point) => { 
            return point.story === parent.id
        })
    }

}

export { Story as default }