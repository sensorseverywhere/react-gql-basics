const Story = 
{
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

}

export { Story as default }