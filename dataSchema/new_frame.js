const ObjectID = require('mongodb').ObjectID

let box1id = ObjectID()
let subtask1id = ObjectID()

module.exports = {
    text: "My first board",
    description: "My first board",
    author: "",
    timestampCreated: new Date().getTime(),
    timestampUpdated: new Date().getTime(),
    members: [],
    boxes: [
        {
            id: box1id,
            text: "To-do", 
            color: "white",
            posId: 0, 
        },
        {
            id: ObjectID(),
            text: "Do today", 
            color: "white",
            posId: 1
        },
        {
            id: ObjectID(),
            text: "In progress", 
            color: "white",
            posId: 2,
            max_tasks: 3
        },
        {
            id: ObjectID(),
            text: "Done", 
            color: "white",
            posId: 3
        }
    ],
    tasks: [
        { 
            id: subtask1id,
            text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
            description: "", 
            members: [], 
            color: "RED", 
            posId: 0, 
            date: "",
            labels: ["New-task"],
            parent: box1id
        },
        { 
            id: ObjectID(),
            text: "To edit a task simply click on it", 
            description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
            members: [], 
            color: "BLUE", 
            posId: 1, 
            date: "",
            labels: ["New-task"],
            parent: box1id
        }
    ],
    subtasks: [
        {
            id: ObjectID(),
            text: "Create a subtask",
            state: "true",
            posId: 0, 
            member: [],
            parent: subtask1id
        },
        {
            id: ObjectID(),
            text: "Deleat a subtask",
            state: "false",
            posId: 1, 
            member: [],
            parent: subtask1id
        }
    ]
}