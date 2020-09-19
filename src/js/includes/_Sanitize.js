class Sanitize {
    static removeBlacklistedChars = text => {
		console.log('hej')
		const blacklist = [`<`, `>`, `'`, `"`, '`']
		
		text.split('').forEach(char => blacklist.forEach(symbol => char === symbol ? text = text.replace(char, '') : ''))
		return text
    }
}