function Tools() {
	let throttle
	this.getScreenHeight = () => window.scrollY
	this.keepPositionY = func => {
		y = this.getScreenHeight()
		func()
		this.scrollToInstantly({top: y})
	}
	this.scrollToInstantly = param => window.scrollTo(param)
	this.throttle = (func, ms) => {
		this.cancelThrottle()
		throttle = setTimeout(() => func(), ms)
	}
	this.cancelThrottle = () => throttle ? clearTimeout(throttle) : ''
	
	this.getSelectedText = element => window.getSelection ? [
		element.value.substring(element.selectionStart, element.selectionEnd), 
		element.selectionStart, 
		element.selectionEnd
	] : ''

	this.wrapSelectedText = (input, symbol) => {
		if(!input.dataset.enablewrite) return
		const [selectedText, startIndex, endIndex] = this.getSelectedText(input)
		input.value = input.value.replaceBetween(`${symbol}${selectedText}${symbol}`, startIndex, endIndex)
	}

	this.cleanAndFormat = text => {
		text = Sanitize.removeBlacklistedChars(text)
		const formated = Sanitize.replaceAllRequestedSymbolsWithSpanTags(text)
		return {cleaned: text, formated: formated}
	}

	this.resizeAreaToFitContent = targetEl => {
		const area = targetEl
		if(!area) return
		const resizeTextarea = () => {
			if(!area.value) this.setAreaHeight(targetEl, '18px')
			else this.setAreaHeight(targetEl, '')
			this.setAreaHeight(targetEl, `${area.scrollHeight}px`)
		}
		this.keepPositionY(resizeTextarea)
	}
	this.setAreaHeight = (targetEl, valueInPx) => targetEl.style.height = valueInPx

	this.getPositionOfEvent = e => {
		let posX, posY
	
		e = !e ? e = window.event : e
		
		if (e.pageX || e.pageY) {
			posX = e.pageX
			posY = e.pageY
		} else if (e.clientX || e.clientY) {
			posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
			posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
		}

		return {
			posX: posX,
			posY: posY
		}
	}
	this.positionAbsoluteBoxAt = (target, x, y) => {
        const targetWidth = target.offsetWidth + 4
        const targetHeight = target.offsetHeight + 4
        const documentWidth = document.innerWidth
        const documentHeight = document.innerHeight

        target.style.left = ((documentWidth - x) < targetWidth) ? `${documentWidth - targetWidth}px` : `${x}px`
        target.style.top = ((documentHeight - y) < targetHeight) ? `${documentHeight - targetHeight}px` : `${y}px`
	}
	
	this.ifAttributesGetValues = (ids) => {
		let arr
		for(const id in ids)
			arr = ids[id] ? {...arr, [id]: ids[id].value} : ''
		return arr.length === ids.length ? arr : ''
	}

	this.focusAndPutCursorAtEnd = target => {
		if(document.activeElement !== target) target.focus()
		let len = target.value.length * 2
		
		setTimeout(function() {
			target.setSelectionRange(len, len)
		}, 1)
		target.scrollTop = 999999
	}
}