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
    
    }
}