function Editor() {
	this.activate = e => e.target.parentElement.classList.add('active-editor')
	this.deactivate = () => {
		const editor = queryTarget('.active-editor')
		console.log(editor.classList)
		if(editor) queryTarget('.active-editor').classList.remove('active-editor')
	}
	this.format = () => ''
	this.url = () => ''



	
	this.resizeTextareaToFitContent = e => {
		const resizeTextarea = () => {
			if(!e.target.value) setTextareaHeight('40px')
			else setTextareaHeight('')
			setTextareaHeight(`${e.target.scrollHeight}px`)
		}
		const setTextareaHeight = valueInPx => e.target.style.height = valueInPx
		tools.keepPositionY(resizeTextarea)
	}
}