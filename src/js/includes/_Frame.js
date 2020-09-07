function Frame(frame) {
	this.insert = (into, content) => queryTarget(into).innerHTML = content
	if(!frame) this.insert('#frame', '')
	this.getData = () => data
	this.getBoxes = () => boxes

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
	const boxes = frame.boxes.map(box => ({
		id: box.id,
		title: box.title,
		color: box.color,
		tasks: box.tasks.map(task => ({
			id: task.id,
			title: task.title,
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
	const getInput = () => {

	}

	this.CRUD = async (method, type, e) => {
		if(!user.data) return
		const input = getInput(method, type, e)
		if(!input) return
		const response = await server.postFetch('method', {method, input, token: cookie.get('token')})
		if(response.status !== 200) return

		if(method === 'create') {
			if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
			else if(['box', 'task', 'subtask'].contains(type)) if(response[type]) render[type](input)
		}
		if(method === 'read') {
			if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
			else if(['box', 'task', 'subtask'].contains(type)) if(response[type]) render[type](input)
		}
		if(method === 'update') {
			if(type === 'frame') if(response.frame) ''
			else if(['box', 'task', 'subtask'].contains(type)) ''
		}
		if(method === 'delete') {
			if(type === 'frame') frame = new Frame()
		else if(['box', 'task', 'subtask'].contains(type)) eject(id) //!id?
		}
	}

	// this.insert('#frame', render.frame(data, this.getBoxes()))
} // 200 = all okej, 400 = did not find data, 500 = server fucked up