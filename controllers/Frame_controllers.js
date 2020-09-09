const ObjectID = require('mongodb').ObjectID

module.exports = {

    /*
        /get/frame
        body: {id: id}

        /update/frame?type="frame|box|task|subtask"
        body: {frameID: id, boxID: id, taskID: id, subtaskID: id}

        /create/frame
        body: {}

        /delete/frame?type="frame|box|task|subtask"
        body: {frameID: id, boxID: id, taskID: id, subtaskID: id}

    */

    postGetFrame: async (req, res) => {
        try {
            data = await req.db.frameCol.findOne({
                $and: [
                    {"_id": req.body.id},
                    {"members": req.token.id}
                ]
            })
            if(data) res.json(data)
            else res.json({message: "could not find frame data", status: 400})
        } catch (error) { console.error(error); }
    },
    postUpdateFrame: async (req, res) => {
        try {
            part = req.query.type
            if(part == 'frame') {
                await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: req.body.data})
                res.json({message: "frame updated", status: 200})
            }
            else if(part == 'box' || part == 'task' || part == 'subtask') {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameID)})

                respons.boxes = respons.boxes.map(e => {
                    if(e.id == req.body.boxID && !req.body.taskID)
                        Object.assign(e, req.body.data)
                    else if(e.id == req.body.boxID)
                        respons.boxes.tasks = e.tasks.map(el => {
                            if(el.id == req.body.taskID && !req.body.subtaskID)
                                Object.assign(el, req.body.data)
                            else if(el.id == req.body.taskID)
                                respons.boxes.subtasks = e.tasks.map(ele => {
                                    if(ele.id == req.body.subtaskID && !req.body.subtaskID)
                                        Object.assign(ele, req.body.data)
                                })

                        })
                    return e
                })

                await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: respons})
                res.json({message: "box update", status: 200})
            }
            else if(part == 'task') await req.db.frameCol.updateOne(
                {
                    "_id": req.body.frameID
                },
                {
                    $set: {
                        'boxes.$[boxs].tasks.$[tasks]': req.body.data
                    }
                },
                {
                    arrayFilters: [ {boxs: req.body.boxID, tasks: req.body.taskID} ]
                }
            )
        } catch (error) {
            console.error(error)
        }
    },
    postCreateFrame: async (req, res) => {
        try {
            type = req.query.type
            if(type == 'frame') {
                require('../modules/rwFiles.js').readFile('/../dataSchema/frame_empty.json', async out => { 
                    frame = out
                    frame.title = req.body.title
                    frame.author = req.token.id
                    frame.timestampCreated = "$$NOW"
                    frame.timestampUpdate = "$$NOW"
                    frame.members.push(req.token.id)
                    if(req.body.boxs) {
                       frame.boxs = req.body.boxs.map((e, i)=> {
                            e.queue = i
                        })
                    }
                    await req.db.frameCol.insertOne(frame)
                })
            }

            res.json({status: 200})
        } catch (error) {
            console.error(error)
        }
    },
    postDeleteFrame: async (req, res) => {
        try {
            res.json({status: 200})
        } catch (error) {
            console.error(error)
        }
    }
}