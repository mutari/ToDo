function Editor(e) {
	if(!e) return
	this.this = e
	const container = this.this.target
	const textarea = container.children.editor
	const formatedArea = container.children.formatedContent
	let previousText
	textarea.value = '' // onreload, make sure textarea is empthy

	this.activate = () => {
		container.classList.add('active-editor')
		previousText = textarea.value
	}
	this.deactivate = cancel => {
		const editorContainer = container
		const area = textarea
		if(!cancel) {
			formatedArea.innerHTML = this.format(area.value)
			tools.setAreaHeight(area)
		} else {
			area.value = previousText
			formatedArea.classList.remove('editor')
		}
		editorContainer.classList.remove('active-editor')
	}

	this.disableWrite = () => {
		const area = textarea
		container.dataset.enablewrite = 'false'
		console.log(previousText)
		formatedArea.innerHTML = this.format(previousText)
		area.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.enableWrite = () => {
		const area = textarea
		area.value = previousText
		formatedArea.innerHTML = previousText
		container.dataset.enablewrite = 'true'
		area.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	this.format = text => tools.testReplaceAllRequestedSymbolsInText(text, symbolStyling)

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

	container.addEventListener('click', e => {
		e.stopPropagation()
		this.activate()
		tools.resizeAreaToFitContent(textarea)
	})
	this.activate()
}