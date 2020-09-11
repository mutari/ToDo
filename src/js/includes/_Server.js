function Server() {
	this.fetch = async dest => {
		try {
			if(!dest) throw 'no destination given on fetch'
			let response = await fetch(getUrl(dest))
			return await response.json()
		} catch (error) {
			console.log(error)
		}
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

	const action = {
		signUp: "/signUp",
		login: "/login",
		user: "/user",
		create: "/frame/create",
		read: "/frame/read",
		update: "/frame/update",
		delete: "/frame/delete",
	}

	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	})
	const getUrl = dest => `ToDo${action[dest]}`
}