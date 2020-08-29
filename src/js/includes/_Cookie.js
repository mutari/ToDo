function Cookie() {
	this.destroy = key => this.create(key,"",-1)
	this.check = key => this.get(key) ? true : false
	this.create = async (key, value, days) => {
		let expires = days ? experationDate(days) : ''
		document.cookie = `${key}=${value}; ${expires}; path=/`
	}
	this.get = key => {
		var key = key + "=";
		var ca = document.cookie.split(';')
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i]
			while (c.charAt(0) == ' ')
				c = c.substring(1)
			if (c.indexOf(key) == 0)
				return c.substring(key.length, c.length)
		}
		return ''
	}
	
	const experationDate = days => {
		const date = new Date()
		date.setTime(date.getTime()+(days*24*60*60*1000))
		return`; expires=${date.toGMTString()}`
	}
}