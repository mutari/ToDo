function Editor(e) {
	if(!e) return
	const container = e.target
	const textarea = container.children.editor
	const formatedArea = container.children.formatedContent
	let previousText = textarea.value
	let beforeWrite
	this.shouldWriteButtonEnable = false

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
		this.shouldWriteButtonEnable = true
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