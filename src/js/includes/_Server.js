function Server() {
	this.data
	const url = {
		init: "",
		signUp: "",
		login: "/login",
	}
	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	this.initFetch = async logedInUser => {
		if(this.data) return
		this.postFetch(url.init, postOption(logedInUser))
	}
    this.postFetch = async (dest, data) => {
		try {
			if(!dest) throw 'no destination given on postFetch'
			if(!data) throw 'no data given on postFetch'
			console.log(url[dest], dest)
			return (await fetch(url[dest], postOption(data))).json()
		} catch (error) {
			console.log(error)
		}
	}

}