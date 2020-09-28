const ObjectID = require('mongodb').ObjectID
const { boxes } = require('../dataSchema/new_frame');
const converter = require('../modules/frameConverter');

module.exports = {
    test: async (req, res) => {
        let respons = await req.db.frameCol.findOne({"_id": ObjectID("5f661c54cd392a045fd91a91")})
        respons = converter.ConvertToNewFrameLayout(req.body.frm)
        console.log(JSON.stringify(respons, null, 4))

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
            else if(type == 'box') {
                respons = await req.db.frameCol.findOne({ "_id": ObjectID(req.body.parentId) })
                respons.boxes = respons.boxes.map(e => {
                    if(e.id.toString() == req.body.id)
                        e = Object.assign(e, req.body.data)
                    return e
                })
                console.log(respons.boxes)
                respons = await req.db.frameCol.updateOne({ "_id": ObjectID(req.body.parentId) }, { $set: respons })
            }
            else if(type == 'task') {
                respons = await req.db.frameCol.findOne({ "_id": ObjectID(req.body.grandParentId) })
                respons.tasks = respons.tasks.map(e => {
                    if(e.id == req.body.id)
                    e = Object.assign(e, req.body.data)
                    return e
                })
                respons = await req.db.frameCol.updateOne({ "_id": ObjectID(req.body.grandParentId) }, { $set: respons })
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
                respons = await createAddPosId(req, req.body.id, type, {
                    id: newID,
                    text: "",
                    color: "gray",
                    timestampCreated: new Date().getTime()
                })
            else if(type == 'task')
                respons = await createAddPosId(req, req.body.parentId, type, {
                    id: newID,
                    text: "",
                    description: "",
                    members: [],
                    color: "gray",
                    date: new Date().getTime(),
                    labels: [],
                    parent: ObjectID(req.body.id),
                    timestampCreated: new Date().getTime()
                }, req.body.id)
            else if(type == 'subtask') // box = boxId, task = id
                respons = await createAddPosId(req, req.body.grandParentId, type, {
                        id: newID,
                        text: "",
                        state: false,
                        members: [],
                        timestampCreated: new Date().getTime()
                    }, req.body.parentId, req.body.id)
            else if(type == 'pos') {
                await postUpdateFramePosition(req, res)
            }

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
    }
}

async function postUpdateFramePosition (req, res) {
    try {
        let respons = await req.db.frameCol.findOne({'_id': ObjectID(req.body.frameId)})
        if(!respons)
            return res.json({message: `did not find a frame white that id: ${req.body.frameId}`, status: 400})
        
            ConvertToNewFrameLayout(req.body.data)




        let rep = await req.db.frameCol.updateOne({"_id": ObjectID(req.body.frameId)}, {$set: respons})
        if(rep)
            return res.json({message: type + " updated frame", status: 200})
    } catch (error) {
        console.error(error)
        return res.json({message: "somthing whent wrong when moving pos", status: 400}) 
    }
}

async function createAddPosId (req, frameId, type, data, boxId, tasksId) {
    let respons = await req.db.frameCol.findOne({ "_id": ObjectID(frameId) })

    if(type == "box") {
        id = 0
        find = false
        respons.boxes.forEach((box, i) => {
            if(!req.body.neighbourId)
                if(box.posId > id)
                    id = box.posId
            else {
                if(box.id == req.body.neighbourId) {
                    data.id = box.id + 1
                    respons.boxes.splice(i + 1, 0, data)
                    find = true;
                }
                if(find)
                    box.id += 1
            }
        })
        if(!req.body.neighbourId) {
            data.posId = id + 1
            respons.boxes.push(data)
        }
    }
    if(type == "task") {
        id = 0
        respons.tasks.forEach(tasks => {
            if(tasks.parent.toString() == boxId && tasks.posId > id)
                id = tasks.posId
        })
        data.posId = id + 1
        respons.tasks.push(data)
    }
    if(type == "subtask") {
        id = 0
        respons.tasks.forEach(subtasks => {
            if(subtasks.parent.toString() == tasksId && subtasks.posId > id)
                id = subtasks.posId
        })
        data.posId = id + 1
        respons.subtasks.push(data)
    }

    console.log(JSON.stringify(respons, null, 4))

    respons = await req.db.frameCol.updateOne({ "_id": ObjectID(frameId) }, { $set: respons })
    return respons
}