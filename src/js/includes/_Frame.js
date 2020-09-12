function Frame(frame) {
	let previousText
	let previousType
	if(!frame) return queryTarget('#frame').innerHTML = ''
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

	this.toggleTextarea = (e, state, save) => {
		if(state) {
			dragAndDrop.stopDndOfActiveTextarea = true
			const parent = contextMenu.extractTarget(e)
			const textarea = parent.children.textarea
			reveal()
			previousText = textarea.value
		} else {
			const textareas = queryTargetAll('textarea.active')
			;[...textareas].forEach(async textarea => {
				try {
					if(save) await this.CRUD('update', previousType)
					hide()
				} catch (error) {
					console.log(error)
					hide()
					textarea.value = previousText
				}
			})
		}
		function hide() {
			textarea.classList.remove('active')
			textarea.readOnly = true
			textarea.blur()
		}
		function reveal() {
			textarea.classList.add('active')
			textarea.readOnly = false
			textarea.focus()
		}
	}

	const getInput = (method, type, e) => {
		let textarea
		let target
		if(method === 'update') {
			textarea = queryTarget('#textarea.active')
			target = textarea.parentElement
			type = target.id
		} else {
			target = contextMenu.extractTarget(e)
		}

		if(type === 'task') {
			const {id, boxId, frameId} = {
				id: target.attributes['data-id'],
				boxId: target.parentElement.attributes['data-id'],
				frameId: target.parentElement.parentElement.attributes['data-id'],
			}
			const ids = id && boxId && frameId ? {id: id.value, boxId: boxId.value, frameId: frameId.value} : ''
			return textarea ? {...ids, ...{data: {text: textarea.value}, type}} : ids
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
		try {
			console.log('hej')
			if(!this.getData()) return
			const input = getInput(method, type, e)
			if(!input) return
			if(input.text) if(input.text === previousText) return
			console.log({type, ...input, token: cookie.get('token')})
			const response = await server.postFetch(method, {type, ...input, token: cookie.get('token')})
			if(validate.status(response.status) || !response.status) throw ''
			return DOMHandler(method, type, e, input)
		} catch (error) {
			console.log(error)
			return Promise.reject()
		}
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
				return Promise.resolve()
			case 'delete':
				if(type === 'frame') frame = new Frame()
				else if(['box', 'task', 'subtask'].contains(type)) render.eject(`.${type}[data-id="${input.id}"]`)
				break
		}
	}
	this.init = async () => {
		try {
			await render.frame({data, boxes})
			dragAndDrop = new DragAndDrop()
		} catch (error) {
			console.log(error)
		}
	}

	this.init()
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