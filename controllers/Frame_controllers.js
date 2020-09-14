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
            if(data) res.json({...data, status: 200})
            else res.json({message: "could not find frame data", status: 400})
        } catch (error) { console.error(error); }
    },
    postUpdateFrame: async (req, res) => {
        console.log(req.body)
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
                req.body.data.timestampUpdated = new Date().getTime()
                let respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)}, {$set: req.body.data})
                if(respons)
                    res.json({message: "frame updated", status: 200})
                else 
                    res.json({message: "frame not updated", status: 400})    
            }
            else if(part == 'box' || part == 'task' || part == 'subtask') {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                respons.timestampUpdated = new Date().getTime()
                if(!respons)
                    res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})

                respons.boxes = respons.boxes.map(e => {
                    if(e.id == req.body.id && !req.body.boxId)
                        Object.assign(e, req.body.data)
                    else if(e.id == req.body.boxId)
                        e.tasks = e.tasks.map(el => {
                            if(el.id == req.body.id && !req.body.taskId) {
                                Object.assign(el, req.body.data)
                                console.log(el)
                            }
                            else if(el.id == req.body.taskId)
                                el.subtasks = el.subtasks.map(ele => {
                                    if(ele.id == req.body.id)
                                        Object.assign(ele, req.body.data)
                                    return ele
                                })
                            return el
                        })
                    return e
                })

                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(respons)
                    res.json({message: part + " update", status: 200})
                else
                    res.json({message: part + "could not be updatet", status: 400})
            }
        } catch (error) {
            console.error(error)
            res.json({message: "Update error", status: 400})
        }
    },
    postCreateFrame: async (req, res) => {
        try {
            type = req.body.type
            if(type == 'frame') {
                require('../modules/rwFiles.js').readFile('/../dataSchema/frame_empty.json', async out => { 
                    frame = out
                    frame.text = req.body.text
                    frame.author = req.token.id
                    frame.members.push(req.token.id)
                    if(req.body.boxs) {
                       frame.boxs = req.body.boxs.map((e, i)=> {
                            e.queue = i
                        })
                    }
                    let respons = await req.db.frameCol.insertOne(frame, {$currentDate: {lastModified: true, "timestampCreated": {$type: "timestamp"}, "timestampUpdate": {$type: "timestamp"}}})
                    if(respons)
                        res.json({status: 200})
                    else
                        res.json({status: 400})
                })
            } 
            else if(type == 'box') {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons) {
                    res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                    return
                }
                
                let newID = ObjectID();

                respons.boxes.push({
                    id: newID,
                    text: "",
                    color: "gray",
                    tasks: []
                })

                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(respons){
                    res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                    return
                }
                else {
                    res.json({message: type + "could not be created", status: 400})
                    return
                }

            }
            else if(type == 'task') {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons) {
                    res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                    return
                }

                let newID = ObjectID()

                respons.boxes.map(e => {
                    if(e.id == req.body.id) {
                        e.tasks.push({
                            id: newID,
                            text: "",
                            description: "",
                            members: [],
                            color: "gray",
                            date: new Date().getTime(),
                            subtasks: [],
                            labels: []
                        })
                    }
                    return e
                })

                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(respons){
                    res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                    return
                }
                else {
                    res.json({message: type + "could not be created", status: 400})
                    return
                }

            }
            else if(type == 'subtask') { // box = boxId, task = id
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons) {
                    res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                    return
                }

                let newID = ObjectID()

                respons.boxes.map(e => {
                    if(e.id == req.body.boxId) {
                        e.tasks.map(el => {
                            if(el.id == req.body.id) {
                                el.tasks.push({
                                    id: newID,
                                    text: "",
                                    state: false,
                                    members: []
                                })
                            }
                        })
                    }
                })

                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(respons){
                    res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                    return
                }
                else {
                    res.json({message: type + "could not be created", status: 400})
                    return
                }

            }
        } catch (error) {
            console.error(error)
        }
    },
    postDeleteFrame: async (req, res) => {
        try {
            part = req.body.type
            if(part == "frame") {
                respons = await req.db.frameCol.remove({"_id": ObjectID(req.body.id)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.id}`, status: 400})
                else
                    return res.json({message: `removed a frame white that id: ${req.body.id}`, status: 200})
            }
            else if(part == "box") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.id) 
                        respons.boxes.splice(i, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(rep)
                    return res.json({message: part + " delete", status: 200})
            }
            else if(part == "task") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.boxId) 
                        for(let j = respons.boxes[i].tasks.length - 1; j >= 0; j--)
                            if(respons.boxes[i].tasks[j].id == req.body.id) 
                                respons.boxes[i].tasks.splice(j, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(rep)
                    return res.json({message: part + " delete", status: 200})
            }
            else if(part == "subtask") {
                respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons)
                    res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                start:
                    for(let i = respons.boxes.length - 1; i >= 0; i--) 
                        if(respons.boxes[i].id == req.body.boxId) 
                            for(let j = respons.boxes[i].tasks.length - 1; j >= 0; j--) 
                                if(respons.boxes[i].tasks[j].id == req.body.taskId) 
                                    for(let x = respons.boxes[i].tasks[j].subtasks.length - 1; x >= 0; x--) 
                                        if(respons.boxes[i].tasks[j].subtasks[x].id == req.body.id) {
                                            respons.boxes[i].tasks[j].subtasks.splice(x, 1);
                                            break start
                                        }
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(rep)
                    return res.json({message: part + " delete", status: 200})
            }
            return res.json({message: "document could not deletet", status: 400})
        } catch (error) {
            console.error(error)
            return res.json({message: "document could not deletet", status: 400})
        }
    }
}