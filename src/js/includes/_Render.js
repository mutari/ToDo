function Render() {
	this.frame = async (data, boxes) => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#render').innerHTML = themplates.frame(data, boxes)
			return Promise.resolve()
		}
	}
	
	this.box = async data => {
		await renderBox()
		toggleTextarea(5, true)
		return Promise.resolve()
		
		function renderBox() {
			const parent = queryTarget(`.box[data-id="${data.idToRenderAt}"`)
			parent.insertAdjacentHTML('afterend', themplates.box({id: 5, title: ' '}))
			return Promise.resolve()
		}
	}
	
	this.taskLarge = async data => {
		const boxes = frame.boxes
		const box = boxes.find(box => box.id == data.parentId)

		const task = {...box.tasks.find(task => task.id == data.id), parent: box.text}
		await renderTaskLarge()
		tools.resizeAreaToFitContent(queryTarget(`.taskLarge[data-id="${task.id}"`).children.textarea)
		if(task.description) {
			const {formated} = tools.cleanAndFormat(task.description, true)
			queryTarget('.editor-container').children.formatedContent.innerHTML = formated
		}
		return Promise.resolve()

		function renderTaskLarge() {
			queryTarget(`#render`).insertAdjacentHTML('beforeend', themplates.taskLarge(task))
			return Promise.resolve()
		}
	}
	this.task = async data => {
		await renderTask()
		toggleTextarea(data.createdId, true)
		return Promise.resolve()

		function renderTask() {
			const parent = queryTarget(`.box[data-id="${data.id}"]`)
			parent.insertAdjacentHTML('beforeend', themplates.task({id: data.createdId, text: ' '}))
			return Promise.resolve()
		}
	}
	this.label = async data => {
		await renderLabel()
		queryTarget('#labelInput').value = ''

		function renderLabel() {
			const targetTaskLarge = queryTarget('#labels').lastElementChild
			const label = themplates.label({id: data.createdId, text: data.text})
			targetTaskLarge.insertAdjacentHTML('beforebegin', label)
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.dropdown = async (target, type, id) => {
		await renderDropdown()
		const dropdownHTML = queryTarget('.dropdown')
		const {posX, posY} = tools.getPostionUnderEventContainer(target)
		tools.positionAbsoluteBoxAt(dropdownHTML, posX, posY)
		return Promise.resolve(dropdownHTML)

		function renderDropdown() {
			queryTarget('.taskLarge-container').insertAdjacentHTML('beforeend', themplates.dropdown(type, id))
			return Promise.resolve()
		}
	}
	this.eject = param => queryTarget(param).remove()
 }