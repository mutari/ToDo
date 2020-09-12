function Frame(frame) {
	this.previousText
	this.previousType
	if(!frame) return queryTarget('#frame').innerHTML = ''
	
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

	this.toggleTextarea = (id, state, save) => {
		const reveal = textarea => {
			this.toggleTextarea()
			tools.resizeAreaToFitContent(textarea)
			textarea.classList.add('active')
			textarea.readOnly = false
			textarea.focus()
		}
		const hide = (textarea) => {
			textarea.classList.remove('active')
			textarea.readOnly = true
			textarea.blur()
		}

		if(state) {
			dragAndDrop.stopDndOfActiveTextarea = true
			const parent = contextMenu ? contextMenu.extractTarget() : queryTarget(`[data-id="${id}"]`)
			const textarea = parent.children.textarea
			reveal(textarea)
			this.previousText = textarea.value
		} else {
			const textareas = queryTargetAll('textarea.active')
			;[...textareas].forEach(async textarea => {
				try {
					if(save) {
						await crud('update', this.previousType)
						textarea.innerHTML = textarea.value
					} else throw ''
					hide(textarea)
				} catch (error) {
					console.log(error)
					hide(textarea)
					textarea.value = this.previousText
				}
			})
		}
	}

	this.init = async () => {
		try {
			await render.frame({data, boxes})
			dragAndDrop = new DragAndDrop()
			// toggleLoadingscreen()
		} catch (error) {
			console.log(error)
		}
	}

	this.init()
}