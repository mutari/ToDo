function Dropdown(e, type, id) {
	const button = e.target
	render.dropdown(button, type, id)
	
	this.deactivate = () => {
		render.eject('.dropdown')
		dropdown = ''
	}
}