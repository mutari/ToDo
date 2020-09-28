
function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User('')
		frame = new Frame({})
		show()
	}

	this.changeFrame = () => {
		
	}
	
	init(datas)
	async function init(datas) {
		if(datas) {
			hide()
			if(datas.frame) frame = new Frame(datas.frame)
			if(datas.token) cookie.create('token', datas.token, 365)
			const loadingscreen = queryTarget('.loadingscreen')
			if(loadingscreen) loadingscreen.remove()
			data = {
				id: datas.user._id,
				name: datas.user.name,
				email: datas.user.email,
			}
			frames = datas.user.frames.map(frame => ({
				id: frame._id,
				title: frame.text,
			}))
		} else {
			try {
				if(cookie.check('token')) datas = await server.postFetch('user', {token: cookie.get('token')})
				console.log(datas)

				if(validate.status(datas.status)) throw 'Login with token failed'
				user = new User(datas)
			} catch (error) {
				console.log(error)
				const loadingscreen = queryTarget('.loadingscreen')
				if(loadingscreen) loadingscreen.remove()
			}
		}
	}
}