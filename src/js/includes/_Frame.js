function Frame(frame) {
	this.previousText
	this.previousType
	if(!frame) return queryTarget('#render').innerHTML = ''
	
	this.getData = () => data
	this.getBoxes = () => boxes
	
	this.addTask = data => boxes.find(box => data.parentId == box.id)
		.tasks.push({id: data.id})

	this.updateTask = data => {
		let task = boxes.find(box => data.parentId == box.id) //! ===
			.tasks.find(task => data.id == task.id) //! ===
		for(const key in data.data) Object.assign(task, {[key]: data.data[key]})
	}

	const data = {
		id: frame._id,
		text: frame.text,
		description: frame.description,
		author: frame.author,
		members: frame.members.map(member => ({
			id: member.id,
			text: member.text,
			profileImgLink: member.profileImgLink,
		})),
	}
	let boxes = frame.boxes.map(box => ({
		id: box.id,
		text: box.text,
		color: box.color,
		tasks: box.tasks.map(task => ({
			id: task.id,
			text: task.text,
			description: task.description,
			color: task.color,
			date: task.date,
			labels: task.labels,
			members: task.members.map(member => member.id),
			subtasks: task.subtasks.map(subtask => ({
				id: subtask.id,
				text: subtask.text,
				member: subtask.member,
			})),
		})),
	}))
	
	init()
	async function init() {
		try {
			await render.frame({data, boxes})
			dragAndDrop = new DragAndDrop()
		} catch (error) {
			console.log(error)
		}
	}
}