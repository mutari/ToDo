function Frame(frame) {
	this.insert = (into, content) => queryTarget(into).innerHTML = content
	if(!frame) this.insert('#frame', '')
	this.getData = () => data
	this.getBoxes = () => boxes

	const data = {
		id: frame.id,
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
	/* const getInput = () => {

	}

	this.toggleFrame = async() => {
		if(!user.data) return
		const id = getInput(e)
		if(!id) return 
		const response = await server.postFetch('read', {id, token: cookie.get('token')})
		if(response.status !== 200) return
		if(response.frame) frame = new Frame(response.frame)
	}
	this.create = async (type, e) => {
		if(!user.data) return
		const input = getInput(e)
		if(!input) return 
		const response = await server.postFetch('create', {type, input, token: cookie.get('token')})
		if(response.status !== 200) return

		if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
		else if(['box', 'task', 'subtask'].contains(type)) if(response[type]) render[type](input)
	}
	this.update = async(e) => {
		if(!user.data) return
		const input = getInput(e)
		if(!input) return 
		const response = await server.postFetch('update', {type, input, token: cookie.get('token')})
		if(response.status !== 200) return

		if(type === 'frame') if(response.frame) ''
		else if(['box', 'task', 'subtask'].contains(type)) ''
	}
	this.delete = async (type, e) =>  {
		if(!user.data) return
		const input = getInput(e)
		if(!input) return
		const response = await server.postFetch('delete', {type, input, token: cookie.get('token')})
		if(response.status !== 200) return

		if(type === 'frame') frame = new Frame()
		else if(['box', 'task', 'subtask'].contains(type)) eject(id) //!id?
	}

	this.insert('#frame', render.frame(data, this.getBoxes())) */
} // 200 = all okej, 400 = did not find data, 500 = server fucked up