function Render() {
	this.frame = async data => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#frame').innerHTML = themplates.frame(data)
			return Promise.resolve()
		}
	}
	this.task = async data => {
		await renderTask()
		frame.toggleTextarea(data.createdId, true)
		function renderTask() {
			queryTarget(`.box[data-id="${data.id}"]`).insertAdjacentHTML('beforeend', themplates.taskMin({id: data.createdId, text: ' '}))
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.eject = param => queryTarget(param).remove()
 }