function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('login')
		user = new User()
		frame = new Frame()
		frame.eject()
	}
	if(datas) {
		if(datas.frame) frame = new Frame(datas.frame)
		if(datas.hash) cookie.create('login', datas.hash, 365)
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
		async () => {
			const response = cookie.check('login') ? await server.postFetch('login', cookie.get('login')) : ''
			if(!response.user) return
			user = new User(response)
		}
	}
}