function Editor() {
	this.activate = e => e.target.parentElement.classList.add('active-editor')
	this.deactivate = () => {
		const editor = queryTarget('.active-editor')
		console.log(editor.classList)
		if(editor) queryTarget('.active-editor').classList.remove('active-editor')
	}
	this.format = () => ''
	this.url = () => ''
}