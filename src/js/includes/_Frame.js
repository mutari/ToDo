function Frame(frame) {
	this.previousText
	this.previousType
	if(!frame) return queryTarget('#render').innerHTML = ''
	
	this.getData = () => data
	this.getBoxes = () => boxes
	
	this.addTask = data => boxes.filter(box => parseInt(data.boxId) === box.id)[0]
		.tasks.push({id: data.id})

	this.updateTask = data => {
		let task = boxes.filter(box => parseInt(data.boxId) === box.id)[0]
			.tasks.filter(task => parseInt(data.id) === task.id)[0]

		for(key in data.data) Object.assign(task, {[key]: data.data[key]})
	}
	

	const data = {
		id: frame._id,
		title: frame.title,
		description: frame.description,
		author: frame.author,
		members: frame.members.map(member => ({
			id: member.id,
			name: member.name,
			profileImgLink: member.profileImgLink,
		})),
	}
	let boxes = frame.boxes.map(box => ({
		id: box.id,
		title: box.name,
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
			// toggleLoadingscreen()
		} catch (error) {
			console.log(error)
		}
	}
}