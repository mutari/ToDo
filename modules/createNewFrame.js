module.exports = async function(req, user, data) {
    try {
        require('../modules/rwFiles.js').readFile('/../dataSchema/frame_start.json', async out => { 
            data.frame = out
            data.frame.author = user._id
            data.frame.members.push({id: user._id, name: user.name}) // add user images
            data.frame.timestampCreated = "$$NOW"
            data.frame.timestampUpdated = "$$NOW"
            data.user.selected_frame = (await req.db.frameCol.insertOne(data.frame))["ops"][0]["_id"]
            console.log("user: ", data.user)
            data.user.frames.push(data.user.selected_frame)
            await req.db.userCol.updateOne({email: req.body.email}, {$set: {selected_frame: data.user.selected_frame, frames: data.user.frames}}, (err, res) => {
                if (err) throw err;
                console.log("1 document updated");
            })
        })
    } catch (error) {
        console.error(error)
    }
    return data
}