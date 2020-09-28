class Sanitize {
    static withHTMLCode(string, reverse) {
		let map = {
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			"`": '&#96;',
		}

		reverse ? Object.entries(map).forEach(([key, value]) => string = string.replace(value, key))
		: string = string.replace(/[<>"'`]/ig, (match)=>(map[match]))
		
		return string
	}
}
