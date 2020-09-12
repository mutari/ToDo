
function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User()
		frame = new Frame()
	}

	this.changeFrame = () => {
		
	}
	this.init = async () => {
		if(datas) {
			if(datas.frame) frame = new Frame(datas.frame)
			if(datas.token) cookie.create('token', datas.token, 365)
			data = {
				id: datas.user._id,
				name: datas.user.name,
				email: datas.user.email,
			}
			frames = datas.user.frames.map(frame => ({
				id: frame.id,
				title: frame.id,
			}))
		} else {
			try {
				const datas = await server.postFetch('user', {token: cookie.get('token')})
				if(!datas) return //if(validate.status(status) || !data) return
				user = new User(datas)
			} catch (error) {
				console.log(error)
			}
		}
	}
	this.init()
}