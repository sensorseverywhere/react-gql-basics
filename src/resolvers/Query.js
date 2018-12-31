const Query = 
{
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
}

export { Query as default }
