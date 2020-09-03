const { json } = require("express")

module.exports = {

    /*
        /get/frame
        body: {id: id}

        /update/frame?type="frame|box|task"
        body: {frameID: id, boxID: id, taskID: id}

        /create/frame
        body: {}

        /delete/frame?type="frame|box|task"
        body: {frameID: id, boxID: id, taskID: id}

    */

    postGetFrame: async (req, res) => {
        try {
            frameId = req.body.id
            userId = req.token.id
            data = await req.db.frameCol.findOne({
                $and: [
                    {"_id": frameId},
                    {"author": userId}
                ]
            })
            res.json(data)
        } catch (error) {
            console.error(error)
        }
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
            
        } catch (error) {
            console.error(error)
        }
    },
    postDeleteFrame: async (req, res) => {
        try {
            
        } catch (error) {
            console.error(error)
        }
    }
}