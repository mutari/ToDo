function Frame({_id, text, description, author, members, boxes}) {
	console.log(boxes)
	this.previousText
	this.previousType
	if(!_id) return queryTarget('#render').innerHTML = ''
	this.getBoxes = () => boxes
	
	this.addTask = data => boxes.find(box => data.parentId == box.id)
		.tasks.push({id: data.id})

	this.updateTask = data => {
		boxes.find(box => data.parentId == box.id) //! ===
			.tasks.find(task => data.id == task.id).map(({taskKey, taskValue}) => {
				for(const key in data.data)
					if(key == taskKey) return {taskKey: data.data[key]}
				return {taskKey: taskValue}
			}); //! ===
	}

	this.data = {
		id: _id,
		text,
		description,
		author,
		members: members.map(member => ({
			id: member.id,
			text: member.text,
			profileImgLink: member.profileImgLink,
		})),
	}
	this.boxes = boxes.map(({id, text, color, posId, tasks}) => ({
		id,
		text,
		color,
		posId,
		tasks: tasks.map(({id, text, description, color, posId, date, labels, members, subtasks}) => ({
			id,
			text,
			description,
			color,
			posId,
			date,
			labels,
			members: members.map(member => member.id),
			subtasks: subtasks.map(({id, text, posId, member}) => ({
				id,
				text,
				posId,
				member,
			})),
		})),
	}))
	
	this.init = async () => {
		try {
			await render.frame(this.data, this.boxes)
			dragAndDrop = new DragAndDrop()
		} catch (error) {
			console.log(error)
		}
	}
	this.init()

	this.screenshot = () => {
		let {attributes, children} = queryTarget('#frame')
		return {
			id: attributes['data-id'].value,
			boxes: [...children].map(({attributes}) => ({
				id: attributes['data-id'].value,
				posId: attributes['data-pos'].value,
				tasks: [...queryTargetAll(`[data-id="${attributes['data-id'].value}"] .task`)].map(({attributes, children}) => ({
					id: attributes['data-id'].value,
					posId: attributes['data-pos'].value,
					subtasks: children.hiddenSubtask ? [...children.hiddenSubtask.children].map(({attributes})=>({
						id: attributes['data-id'].value,
						posId: attributes['data-pos'].value,
					})) : [],
				}))
			}))
		}
	}
}