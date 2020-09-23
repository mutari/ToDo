const ObjectID = require('mongodb').ObjectID

module.exports = {
    ConvertToOldFrameLayout: (frame) => {

        frame.boxes.forEach(box => {
            box.tasks = []
            frame.tasks.forEach(task => {
                if(task.parent.toString() == box.id.toString()) {
                    task.subtasks = []
                    frame.subtasks.forEach(subtasks => {
                        if(subtasks.parent.toString() == task.id.toString()) {
                            task.subtasks.push(subtasks)
                        }
                    })
                    box.tasks.push(task)
                }
            })
        })

        delete frame.tasks
        delete frame.subtasks
        /*
        str = JSON.stringify(frame, null, 4)
        console.log(str)
        */
        return frame
    
    },
    ConvertToNewFrameLayout: (frame) => {
        obj = {}

        obj.tasks = []
        obj.subtasks = []
        obj.id = frame.id
        obj.boxes = frame.boxes.map(box => {
            return { id: box.id, posId: box.posId }
        })
        frame.boxes.forEach(box => {
            box.tasks.forEach(task => {
                obj.tasks.push({id: task.id, posId: task.posId})
            })
        })
        frame.boxes.forEach(box => {
            box.tasks.forEach(task => {
                task.subtasks.forEach(subtask => {
                    obj.subtasks.push({id: subtask.id, posId: subtask.posId})
                })
            })
        })

        return obj

    }
}