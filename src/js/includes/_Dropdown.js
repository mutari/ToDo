function Dropdown(e, type, id) {
	const button = e.target
	let dropdownContainer
	let stopDeactivation = false

	this.deactivate = () => {
		if(stopDeactivation) return stopDeactivation = false
		dropdownContainer.removeEventListener('click', onClickInsideDropdown)
		render.eject('.dropdown')
		dropdown = ''
	}

	init()
	async function init() {
		dropdownContainer = await render.dropdown(button, type, id)
		if(type !== 'colorBtn') {
			dropdownContainer.addEventListener('click', onClickInsideDropdown)
		}
	}
	function onClickInsideDropdown() {
		stopDeactivation = true
	}
}