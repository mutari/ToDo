function Render() {
	this.frame = frame => {
		queryTarget('#renderFrame').innerHTML = themplates.frame(frame)
		Promise.resolve()
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.eject = param => queryTarget(param).remove()
 }