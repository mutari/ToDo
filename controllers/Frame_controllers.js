const ObjectID = require('mongodb').ObjectID
const converter = require('../modules/frameConverter');

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
    test: async (req, res) => {
        let respons = await req.db.frameCol.findOne({"_id": ObjectID("5f661c54cd392a045fd91a91")})
        respons = converter.ConvertToOldFrameLayout(respons)
        console.log(respons)

    },
    postGetFrame: async (req, res) => {
        try {
            let data = await req.db.frameCol.findOne({
                $and: [
                    {"_id": req.body.id},
                    {"members": req.token.id}
                ]
            })
            if(data) res.json({...converter.ConvertToOldFrameLayout(data), status: 200})
            else res.json({message: "could not find frame data", status: 400})
        } catch (error) { console.error(error); }
    },
    postUpdateFrame: async (req, res) => {
        console.log(req.body)
       
        try {
            let type = req.body.type
            let respons;
            if(type == 'frame') {
                req.body.data.timestampUpdated = new Date().getTime()
                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)}, {$set: req.body.data})  
            }
            else if(type == 'box') {
                respons = await req.db.frameCol.updateOne({
                    "_id": ObjectID(req.body.parentId),
                    "boxes.id": ObjectID(req.body.id)
                }, { $set: {
                    "boxes.$": req.body.data 
                }})
            }
            else if(type == 'task') {
                respons = await req.db.frameCol.updateOne({
                    "_id": ObjectID(req.body.parentId),
                    "tasks.id": ObjectID(req.body.id)
                }, { $set: {
                    "tasks.$": req.body.data 
                }})
            }





            if(respons)
                return res.json({message: type + " update", status: 200})
            else
                return res.json({message: type + "could not be updatet", status: 400})
        } catch (error) {
            console.error(error)
            return res.json({message: "Update error", status: 400})
        }
    },
    postCreateFrame: async (req, res) => {
        console.log(req.body)
        try {
            let type = req.body.type
            if(type == 'frame') {
                let frame = require('../dataSchema/new_frame')
                frame.members.push(req.token.id)
                frame.author = req.token.id
                frame.text = req.body.text
                let respons = await req.db.frameCol.insertOne(frame)
                if(respons)
                    return res.json({message: "frame created", status: 200})
                return res.json({message: "frame could not be created", status: 400})
            } 
            else if(type == 'box') {
                let newID = ObjectID();
                let respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id), "boxes.id": req.body.parantId},
                    {
                        $push: {
                            id: newID,
                            text: "",
                            color: "gray",
                            timestampCreated: new Date().getTime()
                        }
                    })

                if(respons)
                    return res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                return res.json({message: `could not create ${type} in frame withe id: ${req.body.id}`, status: 400})
            }
            else if(type == 'task') {
                ConvertToOldFrameLayout(req.db.frameCol.findOne({"_id": ObjectID(req.body.parentId)}))
                let newID = ObjectID();
                let respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)},
                    {
                        $push: {
                            id: newID,
                            text: "",
                            description: "",
                            members: [],
                            color: "gray",
                            date: new Date().getTime(),
                            labels: [],
                            parent: req.body.perentId,
                            timestampCreated: new Date().getTime()
                        }
                    })

                if(respons)
                    return res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                return res.json({message: `could not be created ${type} in frame withe id: ${req.body.id}`, status: 400})
            }
            else if(type == 'subtask') { // box = boxId, task = id
                let newID = ObjectID();
                let respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)},
                    {
                        $push: {
                            id: newID,
                            text: "",
                            state: false,
                            members: [],
                            timestampCreated: new Date().getTime()
                        }
                    })

                if(respons)
                    return res.json({message: type + " created", status: 200, id: ObjectID(newID)})
                return res.json({message: `could not be created ${type} in frame withe id: ${req.body.id}`, status: 400})
            }
        } catch (error) {
            console.error(error)
        }
    },
    postDeleteFrame: async (req, res) => {
        try {
            let type = req.body.type
            if(type == "frame") {
                let respons = await req.db.frameCol.remove({"_id": ObjectID(req.body.id)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.id}`, status: 400})
                else
                    return res.json({message: `removed a frame white that id: ${req.body.id}`, status: 200})
            }
            else if(type == "box") {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.id) 
                        respons.boxes.splice(i, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(rep)
                    return res.json({message: type + " delete", status: 200})
            }
            else if(type == "task") {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
                if(!respons)
                    return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
                for(let i = respons.boxes.length - 1; i >= 0; i--)
                    if(respons.boxes[i].id == req.body.boxId) 
                        for(let j = respons.boxes[i].tasks.length - 1; j >= 0; j--)
                            if(respons.boxes[i].tasks[j].id == req.body.id) 
                                respons.boxes[i].tasks.splice(j, 1);
                let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
                if(rep)
                    return res.json({message: type + " delete", status: 200})
            }
            else if(type == "subtask") {
                let respons = await req.db.frameCol.findOne({"_id": ObjectID(req.body.frameId)})
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
                    return res.json({message: type + " delete", status: 200})
            }
            return res.json({message: "document could not deletet", status: 400})
        } catch (error) {
            console.error(error)
            return res.json({message: "document could not deletet", status: 400})
        }
    },
    postUpdateFramePosition: async (req, res) => {
        try {
            let respons = await req.db.frameCol.findOne({'_id': ObjectID(req.body.frameId)})
            if(!respons)
                return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
            



            req.body.boxes.forEach(e => {
                    
            })




            let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
            if(rep)
                return res.json({message: type + " delete", status: 200})
        } catch (error) {
            console.error(error)
            return res.json({message: "somthing whent wrong when moving pos", status: 400}) 
        }
    }
}