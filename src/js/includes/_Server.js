function Server() {
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

	const action = {
		init: "",
		signUp: "/signUp",
		login: "/login",
	}
	getUrl = dest => `ToDo${action[dest]}`

	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
}