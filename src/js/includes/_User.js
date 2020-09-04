function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User()
		// frame = new Frame()
	}

	this.changeFrame = () => {
		
	}
	this.init = async (datas) => {
		if(datas) {
			if(datas.frame) frame = new Frame(datas.frame)
			if(datas.token) cookie.create('token', datas.token, 365)
			data = {
				id: datas.user.id,
				name: datas.user.name,
				email: datas.user.email,
			}
			frames = datas.user.frames.map(frame => ({
				id: frame.id,
				title: frame.id,
			}))
		} else {
			try {
				const response = cookie.check('token') ? await server.postFetch('login', {token: cookie.get('token')}) : '';
				console.log(response)
				if(!response.user) return
				user = new User(response)
			} catch (error) {
				console.log(error)
			}
		}
	}
	this.init(datas)
}