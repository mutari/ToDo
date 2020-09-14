function Cookie() {
	this.destroy = key => this.create(key,"",-1)
	this.check = key => this.get(key) ? true : false
	this.create = async (key, value, days) => {
		let expires = days ? experationDate(days) : ''
		document.cookie = `${key}=${value}${expires}; path=/`
	}
	this.get = key => {
		key = `${key}=`
		var content = document.cookie.split(';')
		for(let info of content) {
			while (info.charAt(0) == ' ')
				info = info.substring(1)
			if (info.indexOf(key) == 0)
				return info.substring(key.length, info.length)
		}
		return ''
	}
	
	const experationDate = days => {
		const date = new Date()
		date.setTime(date.getTime()+(days*24*60*60*1000))
		return`; expires=${date.toGMTString()}`
	}
}