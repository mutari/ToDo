function Frame(frame) {
	if(!frame) queryTarget('#frame').innerHTML = ''
	//frame = testData.frameJson
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
	const getInput = (method, type, e) => {
		const id = e.target.parentElement.attributes['data-id'].value // id from context menu
		const target = queryTarget(`.${type}[data-id*="${id}"]`) // get the selected element
		if(type === 'task') {
			const {id, boxId, frameId} = {
				id: target.attributes['data-id'],
				boxId: target.parentElement.attributes['data-id'],
				frameId: target.parentElement.parentElement.attributes['data-id'],
			}
			 return id && boxId && frameId ? {id: id.value, boxId: boxId.value, frameId: frameId.value} : ''
		} else if(type === 'box') {
			const {id, frameId} = {
				id: target.attributes['data-id'],
				frameId: target.parentElement.attributes['data-id'],
			}
			return id && frameId ? {id: id.value, frameId: frameId.value} : ''
		} else if(type === 'frame') {
			const id = target.attributes['data-id']
			return id ? {id: id.value} : ''
		}
	}

	this.CRUD = async (method, type, e) => {
		if(!this.getData()) return
		const input = getInput(method, type, e)
		if(!input) return
		console.log(input, method)
		const response = await server.postFetch(method, {type, input, token: cookie.get('token')})
		console.log(response)
		if(validate.status(response.status)) return

		DOMHandler(method, type, e, input)
	}

	function DOMHandler(method, type, e, input) {
		switch (method) {
			case 'create':
				if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
				else if(['box', 'task', 'subtask'].contains(type)) if(response[type]) render[type](input)
				break
			case 'read':
				if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
				else if(['box', 'task', 'subtask'].contains(type)) if(response[type]) render[type](input)
				break
			case 'update':
				if(type === 'frame') if(response.frame) ''
				else if(['box', 'task', 'subtask'].contains(type)) ''
				break
			case 'delete':
				console.log(`.${type}[data-id="${input.id}"]`)
				if(type === 'frame') frame = new Frame()
				else if(['box', 'task', 'subtask'].contains(type)) render.eject(`.${type}[data-id="${input.id}"]`)
				break
		}
	}
	this.init = async () => {
		await render.frame({data, boxes})
		dragAndDrop = new DragAndDrop()
	}

	this.init()
	render.frame({data, boxes})
}




/* 

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
		} */