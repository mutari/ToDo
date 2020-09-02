module.exports = {
    postGetFrame: (req, res) => {
        console.log(req.body)
    },
    postUpdateFrame: async (req, res) => {
        try {
            part = req.query.part
            await req.db.frameCol.update({"_id": req.body.frameID})
        } catch (error) {
            console.error(error)
        }
    }
}