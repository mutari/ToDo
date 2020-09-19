class Sanitize {
    static removeBlacklistedChars = text => {
        const blacklist = [`<`, `>`, `'`, `"`, '`']
		const threatsToRemove = blacklist.map(threat => text.indicesOf(threat))
		threatsToRemove.forEach(indices => indices.forEach(index => text = text.replaceAt(index, ' ')))
		return text
    }



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
}