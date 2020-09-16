
function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User('')
		frame = new Frame()
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
				id: frame.id,
				title: frame.id,
			}))
		} else {
			try {
				if(cookie.check('token')) datas = await server.postFetch('user', {token: cookie.get('token')})
				if(!datas) throw ''
				user = new User(datas)
			} catch (error) {
				window.show()
				const loadingscreen = queryTarget('.loadingscreen')
				if(loadingscreen) loadingscreen.remove()
				console.log(error)
			}
		}
	}
}