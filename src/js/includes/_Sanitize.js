class Sanitize {
    static escapeUnicode = text => {
		const getUnicode = c => "\\u" + ("000" + c.charCodeAt().toString(16)).slice(-4)
		return text.replace('/[\u00A0-\uffff]/g', getUnicode)
	}
}
