function Render() {
	this.frame = async data => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#render').innerHTML = themplates.frame(data)
			return Promise.resolve()
		}
	}
	this.box = async data => {
		console.log('hej')
		await renderBox()
		toggleTextarea(5, true)
		return Promise.resolve()
		
		function renderBox() {
			queryTarget(`.box[data-id="${data.idToRenderAt}"`).insertAdjacentHTML('afterend', themplates.box({id: 5, title: ' '}))
			return Promise.resolve()
		}
	}
	this.taskLarge = async (data) => {
		const boxes = frame.getBoxes()
		const box = boxes.find(box => box.id == data.boxId)
		const task = {...box.tasks.find(task => task.id == data.id), parent: box.text}
		console.log(task)
		await renderTaskLarge()
		tools.resizeAreaToFitContent(queryTarget(`.taskLarge[data-id="${task.id}"`).children.textarea)
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
			queryTarget(`.box[data-id="${data.id}"]`).insertAdjacentHTML('beforeend', themplates.task({id: data.createdId, text: ' '}))
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.eject = param => queryTarget(param).remove()
 }