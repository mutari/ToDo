module.exports = {

    /*
        /get/frame
        body: {id: id}

        /update/frame?type="frame|box|task|subtask"
        body: {frameID: id, boxID: id, taskID: id}

        /create/frame
        body: {}

        /delete/frame?type="frame|box|task|subtask"
        body: {frameID: id, boxID: id, taskID: id}

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
            await req.db.frameCol.update({"_id": req.body.frameID})
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