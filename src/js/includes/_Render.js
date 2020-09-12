function Render() {
	this.frame = async frame => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#frame').innerHTML = themplates.frame(frame)
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.eject = param => queryTarget(param).remove()
 }