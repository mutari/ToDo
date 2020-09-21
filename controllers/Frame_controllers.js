const ObjectID = require('mongodb').ObjectID
const converter = require('../modules/frameConverter');

module.exports = {
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
        console.log("update: ", req.body)
        try {
            let type = req.body.type
            let respons;
            if(type == 'frame') {
                req.body.data.timestampUpdated = new Date().getTime()
                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)}, {$set: req.body.data})  
            }
            else if(type == 'box')
                respons = await req.db.frameCol.updateOne(
                    { "_id": ObjectID(req.body.parentId), "boxes.id": ObjectID(req.body.id) }, 
                    { $set: { "boxes.$.text": req.body.data.text }})
            else if(type == 'task')
                respons = await req.db.frameCol.updateOne(
                    { "_id": ObjectID(req.body.grandParentId), "tasks.id": ObjectID(req.body.id) }, 
                    { $set: { "tasks.$.text": req.body.data.text }})

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
        console.log("create", req.body)

        try {
            let type = req.body.type
            let newID = ObjectID();
            if(type == 'frame') {
                let frame = require('../dataSchema/new_frame')
                frame.members.push(req.token.id)
                frame.author = req.token.id
                frame.text = req.body.text
                respons = await req.db.frameCol.insertOne(frame)
            } 
            else if(type == 'box')
                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.id)},
                    {
                        $push: {
                            boxes: {
                                id: newID,
                                text: "",
                                color: "gray",
                                timestampCreated: new Date().getTime()
                            }
                        }
                    })
            else if(type == 'task')
                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.parentId)},
                    {
                        $push: {
                            tasks: {
                                id: newID,
                                text: "",
                                description: "",
                                members: [],
                                color: "gray",
                                date: new Date().getTime(),
                                labels: [],
                                parent: ObjectID(req.body.id),
                                timestampCreated: new Date().getTime()
                            }
                        }
                    })
            else if(type == 'subtask') // box = boxId, task = id
                respons = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.grandParentId)},
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
            return res.json({message: `could not create ${type} in frame withe id: ${req.body.id}`, status: 400})
        } catch (error) {
            console.error(error)
            return res.json({message: `could not create ${type} in frame withe id: ${req.body.id}`, status: 400})
        }
    },
    postDeleteFrame: async (req, res) => {
        console.log("delete: ", req.body)
        try {
            let type = req.body.type
            let respons
            if(type == "frame")
                respons = await req.db.frameCol.remove({"_id": ObjectID(req.body.id)})
            else if(type == "box")
                respons = await req.db.frameCol.updateOne(
                    { '_id': ObjectID(req.body.parentId) },
                    { $pull: { "boxes": { id: ObjectID(req.body.id) } } }
                )
            else if(type == "task")
                respons = await req.db.frameCol.updateOne(
                    { '_id': ObjectID(req.body.grandParentId) },
                    { $pull: { "tasks": { id: ObjectID(req.body.id) } } }
                )
            else if(type == "subtask")
                respons = await req.db.frameCol.updateOne(
                    { '_id': ObjectID(req.body.grandGrandParentId) },
                    { $pull: { "subtasks": { id: ObjectID(req.body.id) } } }
                )
            if(respons)
                return res.json({message: type + " deleted", status: 200})
            return res.json({message: `could not delete ${type} in frame withe id: ${req.body.id}`, status: 400})
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
            
            




            let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
            if(rep)
                return res.json({message: type + " updated frame", status: 200})
        } catch (error) {
            console.error(error)
            return res.json({message: "somthing whent wrong when moving pos", status: 400}) 
        }
    }
}