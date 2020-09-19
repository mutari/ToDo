function Editor(e) {
	if(!e) return
	const container = e.target
	const textarea = container.children.editor
	const formatedArea = container.children.formatedContent
	let previousText = textarea.value
	let beforeWrite
	this.shouldWriteButtonEnable = false

	this.deactivate = save => {
		const editorContainer = container
		editorContainer.classList.remove('active-editor')
		container.removeEventListener('click', containerOnClick)
		if(save) {
			this.format(textarea.value)
			tools.setAreaHeight(textarea)
			return
		}
		textarea.value = previousText
		formatedArea.classList.remove('editor')
	}

	this.format = text => {
		const {cleaned, formated} = tools.cleanAndFormat(text)
		textarea.value = cleaned
		formatedArea.innerHTML = formated
	}

	this.preview = () => {
		this.shouldWriteButtonEnable = true
		beforeWrite = textarea.value
		this.format(beforeWrite)
		textarea.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.write = () => {
		textarea.value = beforeWrite
		formatedArea.innerHTML = previousText
		textarea.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	const containerOnClick = e => {
		e.stopPropagation() //stop deactivation of editor while inside container
	}
	
	container.addEventListener('click', containerOnClick)
	container.classList.add('active-editor')
	tools.resizeAreaToFitContent(textarea)
	tools.focusAndPutCursorAtEnd(textarea)
}