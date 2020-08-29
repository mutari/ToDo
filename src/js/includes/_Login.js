function Login(data) {
	let user
	let frames
	this.getUser = () => user
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('login')
		login = new Login()
		frame = new Frame()
		frame.eject()
	}
	if(data) {
		if(data.frame) frame = new Frame(data.frame)
		if(data.hash) cookie.create('login', data.hash, 365)
		user = {
			id: data.user.id,
			name: data.user.name,
			email: data.user.email,
		}
		frames = data.user.frames.map(frame => ({
			id: frame.id,
			title: frame.id,
		}))
	} else {
		async () => {
			const response = cookie.check('login') ? await server.postFetch('login', cookie.get('login')) : ''
			if(!response.user) return
			login = new Login(response)
		}
	}
}