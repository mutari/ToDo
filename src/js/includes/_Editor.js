function Editor(e) {
	if(!e) return
	this.this = e
	const container = this.this.target
	const textarea = container.children.editor
	const formatedArea = container.children.formatedContent
	let previousText
	let beforeWrite
	this.write = false
	previousText = textarea.value

	this.activate = () => container.classList.add('active-editor')
	this.deactivate = cancel => {
		const editorContainer = container
		if(!cancel) {
			this.format(textarea.value)
			tools.setAreaHeight(textarea)
		} else {
			textarea.value = previousText
			formatedArea.classList.remove('editor')
		}
		editorContainer.classList.remove('active-editor')
		container.removeEventListener('click', containerOnClick)
	}

	this.disableWrite = () => {
		this.write = true
		beforeWrite = textarea.value
		this.format(beforeWrite)
		textarea.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.enableWrite = () => {
		textarea.value = beforeWrite
		formatedArea.innerHTML = previousText
		textarea.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	this.format = text => {
		text = tools.removeBlacklistedChars(text, blacklist)
		textarea.value = text
		formatedArea.innerHTML = tools.replaceAllRequestedSymbolsWithSpanTags(text, symbolStyling)
	}

	const symbolStyling = [
		{
			symbol: '*',
			class: 'bold',
		},
		{
			symbol: '|',
			class: 'italic',
		},
		{
			symbol: '_',
			class: 'underline',
		},
		{
			symbol: '~',
			class: 'strikeThrough',
		},
	]
	const blacklist = [`<`, `>`, `'`, `"`, '`']
	const containerOnClick = e => {
		e.stopPropagation()
		this.activate()
		tools.resizeAreaToFitContent(textarea)
	}
	container.addEventListener('click', containerOnClick);

	this.activate()
}