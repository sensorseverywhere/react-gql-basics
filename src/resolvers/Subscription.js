const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => 
            {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            //return pubsub.asyncIterator('count')
        }
    },
    card: {
        subscribe(parent, { storyId }, { db, pubsub }, info) {
            const story = db.stories.find((s) => s.id === storyId)

            if( !story ) {
                throw new Error('Story not found')
            }

            return pubsub.asyncIterator(`card ${storyId}`)
        }
    }
}

export { Subscription as default }