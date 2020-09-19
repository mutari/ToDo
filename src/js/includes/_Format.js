class Format {
	static replaceAllRequestedSymbolsWithSpanTags = input => {
		const translations = [
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

	static replaceAllRequestedSymbolsWithSpanTags2 = input => {
		const symbolsDatas = [
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
		const combinationsDatas = [
			{
				combo: '* ',
				replacement: '\&#8226 ',
			},
		]
        
		let output = '', classes = '', isSymbol, index = 0
		const charArr = input.split('')
		
		while(index < charArr.length) {
			isSymbol = false
			symbolsDatas.forEach(symbolData => {
				if(charArr[index] === symbolData.symbol) {
					isSymbol = true
					if(symbolData.isAlive) {
						if(charArr[index-1] === ' ') addToOutput(charArr[index])
						else {
							addToOutput(tags(false))
							removeClass(symbolData.class)
							symbolData.isAlive = false
						}
					} else {
						if(charArr[index+1] === ' ') addToOutput(charArr[index])
						else {
							addClass(symbolData.class)
							addToOutput(tags(true, symbolData.class))
							symbolData.isAlive = true
						}
					}
				}
			})
			if(!isSymbol) addToOutput(charArr[index])
			index++
		}

		index = 0
		combinationsDatas.forEach(combinationData => {
			while ((index = output.indexOf(combinationData.combo, index)) > -1) {
				output = output.replace(combinationData.combo, combinationData.replacement)
				index += combinationData.combo.length
			}
				
		})

		return output


		function addToOutput(text) { output += text }
		function tags(opening, className) {
			return opening ? 
				classes.indicesOf(' ').length === 1 ? `<span class="${className}">` : `</span><span class="${classes}">`
				: `</span>`
		}
		function addClass(className){
			classes += `${className} `
		}
		function removeClass(className) {
			classes = classes.replace(`${className} `, '')
		}
	}

	static addTabAtCursor(target) {
		const tab = '\t'
		const {startIndex, endIndex} = tools.getSelectedText(target)
		target.value = target.value.replaceBetween(tab, startIndex, endIndex)
		tools.putCursorAtIndex(target, startIndex+1)
	}
}