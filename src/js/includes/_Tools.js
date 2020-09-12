function Tools() {
	let throttle
	this.getPositionY = () => window.scrollY
	this.keepPositionY = func => {
		y = this.getPositionY()
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

	this.replaceAllRequestedSymbolsWithSpanTags = (input, translations) => {
		let output = ''
		let classes
		let notSymbol = true
		const charArr = input.split('')
		const setActiveClasses = () => translations.map(translation => translation.live ? classes += `${translation.class} ` : '')

		charArr.map(char => {
			notSymbol = true
			translations.map(data => {
				if(char !== data.symbol) return
				notSymbol = false
				classes = ''

				if(!data.live) {
					setActiveClasses()
					data.live = true
				} else {
					data.live = false
					setActiveClasses()
				}

				if(classes) {
					if(data.live) classes += data.class
					output += `</span><span class="${classes}">`
				} else if(data.live) output += `<span class="${data.class}">`
				else output += `</span>`
			})
			if(notSymbol) output += char
		})
		return output
	}

	this.removeBlacklistedChars = (text, blacklist) => {
		const threatsToRemove = blacklist.map(threat => text.indicesOf(threat))
		threatsToRemove.forEach(indices => indices.forEach(index => text = text.replaceAt(index, ' ')))
		return text
	}

	this.resizeAreaToFitContent = targetEl => {
		const area = targetEl
		if(!area) return
		const resizeTextarea = () => {
			if(!area.value) this.setAreaHeight(targetEl, '0px')
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
        targetWidth = target.offsetWidth + 4
        targetHeight = target.offsetHeight + 4
        documentWidth = document.innerWidth
        documentHeight = document.innerHeight

        target.style.left = ((documentWidth - x) < targetWidth) ? `${documentWidth - targetWidth}px` : `${x}px`
        target.style.top = ((documentHeight - y) < targetHeight) ? `${documentHeight - targetHeight}px` : `${y}px`
    }
}