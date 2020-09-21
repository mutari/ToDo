class Sanitize {
    static escapeUnicode = text => {
		const unicodeToEscape = '/[\u00A0-\uffff]/g'
		return text.replace(unicodeToEscape, getUnicode())
		function getUnicode() {
			return "\\u" + ("000" + c.charCodeAt().toString(16)).slice(-4)
		}
	}
}