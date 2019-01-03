const users = [
    {
        id: '1',
        name: 'Wade',
        email: 'wade@wade.com',
        type: 'author',
        isMember: true
    },
    {
        id: '2',
        name: 'Soph',
        email: 'soph@soph.com',
        type: 'subscriber',
        isMember: false
    }, 
    {
        id: '3',
        name: 'Grace',
        email: 'youngest@child.com',
        type: 'author',
        isMember: true
    },
    {
        id: '4',
        name: 'Camille',
        email: 'eldest@child.com',
        type: 'subscriber',
        isMember: true
    }
]

const stories = [
    {
        id: '1',
        title: 'My first piece of content',
        body: 'Here is a short story',
        type: 'Short Story',
        author: '2',
        published: false
    },
    {
        id: '2',
        title: 'My second piece of content',
        body: 'Here is a novel',
        type: 'Novel',
        author: '1',
        published: true
    },
]

const lines = [
    {
        id: '1',
        story: '1',
        name: 'main',
        description: 'The main story line',
        colour: 'black',
        author: '1',
        points: '1'
    },
    {
        id: '2',
        story: '1',
        name: 'Jelly',
        description: 'Jelly\'s story arc',
        colour: 'yellow',
        author: '1'
    },
    {
        id: '3',
        story: '2',
        name: 'Anami',
        description: 'Anami\'s story arc',
        colour: 'red',
        author: '2'
    }, 
    { 
        id: '4',
        story: '1',
        name: 'Boo',
        description: 'Boo\'s story arc',
        colour: 'blue',
        author: '1'
    }

]

const cards = [
    {
        id: '1',
        author: '2',
        story: '1',
        line: '1',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    },
    {
        id: '2',
        author: '2',
        story: '2',
        line: '3',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    },
    {
        id: '3',
        author: '2',
        story: '4',
        line: '3',
        title: "Jellys Character Card",
        text: "Jelly first meets Boo",
        type: "Character"      
    }
]

const points = [
    {
        id: '1',
        x: 234.34,
        y: 345,
        line: '1',
        colour: 'red',
        author: '1',
        story: '2'
    },
    {
        id: '2',
        x: 234.34,
        y: 345,
        line: '2',
        author: '2',
        story: '2',
        colour: 'red'
    }
]

const db = {
    users,
    stories,
    lines,
    cards,
    points
}

export { db as default }
