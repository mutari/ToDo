function Editor(e) {
	if(!e) return
	const formatedArea = e.target
	const textarea = formatedArea.previousElementSibling
	const container = formatedArea.parentElement
	this.previousText = textarea.value
	let beforePreview
	this.shouldWriteButtonEnable = false

	this.deactivate = async save => {
		if(save) {
			try {
				const text = textarea.value
				await crud.run({method: 'update', type: 'description', data: {description: Sanitize.withHTMLCode(text)}})
				this.format(text)
			} catch (error) {
				console.log(error)
			}
		} else {
			textarea.value = this.previousText
			this.format(this.previousText)
		}
		container.classList.remove('active-editor')
		container.removeEventListener('click', containerOnClick)
		tools.setAreaHeight(textarea)
		formatedArea.classList.remove('editor')
	}

	this.format = text => {
		const {formated} = tools.cleanAndFormat(text)
		formatedArea.innerHTML = formated
	}

	this.preview = () => {
		this.shouldWriteButtonEnable = true
		beforePreview = textarea.value
		this.format(beforePreview)
		textarea.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.write = () => {
		textarea.value = beforePreview
		formatedArea.innerHTML = this.previousText
		textarea.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	const containerOnClick = e => {
		e.stopPropagation() //stop deactivation of editor while inside container
	}
	
	textarea.classList.remove('hide')
	container.addEventListener('click', containerOnClick)
	container.classList.add('active-editor')
	tools.resizeAreaToFitContent(textarea)
	tools.focusAndPutCursorAtEnd(textarea)
}