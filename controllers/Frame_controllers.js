const { ObjectId } = require('mongodb')

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
        /*
            {
                "frameID": "5f58f2b99beba708b6f0250d",
                "boxID": "0",
                "taskID": "1",
                "subtaskID": "0",
                "data": {"text": "My subtask test (123)"}
            }
        */
        try {
            part = req.body.type
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
                        e.tasks = e.tasks.map(el => {
                            if(el.id == req.body.taskID && !req.body.subtaskID)
                                Object.assign(el, req.body.data)
                            else if(el.id == req.body.taskID)
                                el.subtasks = el.subtasks.map(ele => {
                                    if(ele.id == req.body.subtaskID)
                                        Object.assign(ele, req.body.data)
                                    return ele
                                })
                            return el
                        })
                    return e
                })

                await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: respons})
                res.json({message: part + " update", status: 200})
            }
        } catch (error) {
            console.error(error)
        }
    },
    postCreateFrame: async (req, res) => {
        try {
            type = req.body.type
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
            part = req.body.type
            if(part == "frame")
                await req.db.frameCol.remove({"_id": ObjectID(req.body.frameID)})
            else if(part == "box") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameID)})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.boxID) 
                        respons.boxes.splice(i, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: respons})
                if(rep)
                    res.json({message: part + " delete", status: 200})
            }
            else if(part == "task") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameID)})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.boxID) 
                        for(let j = respons.boxes[i].tasks.length - 1; j >= 0; j--)
                            if(respons.boxes[i].tasks[j].id == req.body.taskID) 
                                respons.boxes[i].tasks.splice(j, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: respons})
                if(rep)
                    res.json({message: part + " delete", status: 200})
            }
            else if(part == "subtask") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameID)})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.boxID) 
                        for(let j = respons.boxes[i].tasks.length - 1; j >= 0; j--)
                            if(respons.boxes[i].tasks[j].id == req.body.taskID) 
                                for(let x = respons.boxes[i].tasks[j].subtasks.length - 1; x >= 0; x--)
                                    if(respons.boxes[i].tasks[j].subtasks[x].id == req.body.subtaskID)
                                        respons.boxes[i].tasks[j].subtasks.splice(x, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameID)}, {$set: respons})
                if(rep)
                    res.json({message: part + " delete", status: 200})
            }
            res.json({message: "document not deletet?", status: 400})
        } catch (error) {
            console.error(error)
        }
    }
}