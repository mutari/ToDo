function Server() {
	this.data
	const action = {
		init: "",
		signUp: "/signUp",
		login: "/login",
	}
	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	getUrl = dest => {
		let string = action[dest]
		if(string) return `ToDo${action[dest]}`
	}
	this.initFetch = async logedInUser => {
		if(this.data) return
		this.postFetch(url.init, postOption(logedInUser))
	}
    this.postFetch = async (dest, data) => {
		try {
			if(!dest) throw 'no destination given on postFetch'
			if(!data) throw 'no data given on postFetch'
			let response = await fetch(getUrl(dest), postOption(data))
			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}

}