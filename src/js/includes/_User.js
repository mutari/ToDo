function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User()
		frame.eject()
		frame = new Frame()
	}

	this.changeFrame = () => {
		
	}
	this.init = async () => {
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
			const response = cookie.check('token') ? await server.postFetch('login', {token: cookie.get('token')}) : ''
			if(!response.user) return
			user = new User(response)
		}
	}
	this.init()
}