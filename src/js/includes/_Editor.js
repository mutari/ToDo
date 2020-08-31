function Editor() {
	this.activate = e => e.target.parentElement.classList.add('active-editor')
	this.deactivate = () => {
		const editor = queryTarget('.active-editor')
		if(editor) queryTarget('.active-editor').classList.remove('active-editor')
	}
	this.link = () => ''

	this.format = () => {
		let text = queryTarget('.active-editor').children.editor.value
		while(true) {
			if(text.indexOf('*') === -1) return
			text = text.replace('*', '<span style="bold">')
			if(text.indexOf('*') === -1) return
			text = text.replace('*', '</span>')
			queryTarget('.active-editor').children.editor.value = text
		}
	}

	this.wrapSelectedText = symbol => {
		const editor = queryTarget('.active-editor').children.editor
		const selectedText = tools.getSelectedText(editor)
		editor.value = editor.value.replace(selectedText, `${symbol}${selectedText}${symbol}`)
	}

	this.oldFormat = command => document.execCommand(command,false,null)

	this.resizeTextareaToFitContent = () => {
		const editor = queryTarget('.active-editor')
		if(!editor) return
		const textarea = editor.children.editor
		const resizeTextarea = () => {
			if(!textarea.value) setTextareaHeight('40px')
			else setTextareaHeight('0')
			setTextareaHeight(`${textarea.scrollHeight}px`)
		}
		const setTextareaHeight = valueInPx => textarea.style.height = valueInPx
		tools.keepPositionY(resizeTextarea)
	}
}