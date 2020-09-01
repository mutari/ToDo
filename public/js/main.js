const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }

const testData = new TestData()
const tools = new Tools()
const editor = new Editor()
const server = new Server()
const cookie = new Cookie()
let user = new User()
let frame
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener("input", e => {
    if(e.target.type === 'textarea') editor.resizeTextareaToFitContent(e)
    if(['signUp', 'login'].contains(grandParentId(e))) validate.input(e)
})
document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(['signUp', 'login'].contains(id)) form.submit(e)
})

document.addEventListener("click", e => {
    console.log(e)
    if(!queryTarget('.active-editor')) return
    editor.format()
    editor.deactivate()
})
;[...queryTargetAll('#editor-container')].map(container => {
    container.addEventListener('click', e => {
        e.stopPropagation()
        if(e.target !== document) {
            const id = targetId(e)
            if(parentId(e) === 'editor-container') editor.activate(e)
        }
    })
})
document.onmousedown = function(e){
    const id = targetId(e)
    if(!['bold', 'italic', 'insertunorderedlist', 'link', 'underline'].contains(id)) return
    e = e || window.event
    e.preventDefault()
    if(id === 'bold') editor.wrapSelectedText('*')
    if(id === 'italic') editor.wrapSelectedText('|')
    if(id === 'underline') editor.wrapSelectedText('_')
}
function TestData() {
    this.login = {
        email: 'test123@test123.se',
        password: 'aaaaaaaa' 
    }
    
    this.signUp1 = { //complete success
        name: 'Egyuik wewewe',
        email: 'test123@test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp2 = { // invalid name and email (misses "."), password too short and doesn't match comfirm
        name: 'Egyuik',
        email: 'test123@test123se',
        password: 'aaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp3 = { // invalid name and email (misses "@"), comfirm doesn't match password
        name: 'Egyuik',
        email: 'test123test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaa',
    }
    this.cookie = () => { // true; hej; false;
        cookie.create('name', 'hej', 5)
        console.log(cookie.check('name'))
        console.log(cookie.get('name'))
        cookie.destroy('name')
        console.log(cookie.check('name'))
    }
}
function Announce() {
    this.formFeedback = errorMessages => {
      for(let key in errorMessages)
        errorMessages[key] ? inputError(errorMessages[key], key) : inputSuccess(key)
    }
    inputSuccess = id => console.log('success', id)
    inputError = (message, id) => console.log(message, id)
}
function Cookie() {
	this.destroy = key => this.create(key,"",-1)
	this.check = key => this.get(key) ? true : false
	this.create = async (key, value, days) => {
		let expires = days ? experationDate(days) : ''
		document.cookie = `${key}=${value}${expires}; path=/`
	}
	this.get = key => {
		key = `${key}=`
		var content = document.cookie.split(';')
		for(info of content) {
			while (info.charAt(0) == ' ')
				info = info.substring(1)
			if (info.indexOf(key) == 0)
				return info.substring(key.length, info.length)
		}
		return ''
	}
	
	const experationDate = days => {
		const date = new Date()
		date.setTime(date.getTime()+(days*24*60*60*1000))
		return`; expires=${date.toGMTString()}`
	}
}
function Editor() {
	this.activate = e => e.target.parentElement.classList.add('active-editor')
	this.deactivate = () => {
		const editor = queryTarget('.active-editor')
		if(editor) queryTarget('.active-editor').classList.remove('active-editor')
	}
	this.link = () => ''

	this.format = () => {
		let text = queryTarget('.active-editor').children.editor.value
		while(true) {
			if(text.indexOf('*') === -1) return
			text = text.replace('*', '<span style="bold">')
			if(text.indexOf('*') === -1) return
			text = text.replace('*', '</span>')
			queryTarget('.active-editor').children.editor.value = text
		}
	}

	this.wrapSelectedText = symbol => {
		const editor = queryTarget('.active-editor').children.editor
		const selectedText = tools.getSelectedText(editor)
		editor.value = editor.value.replace(selectedText, `${symbol}${selectedText}${symbol}`)
	}

	this.oldFormat = command => document.execCommand(command,false,null)

	this.resizeTextareaToFitContent = () => {
		const editor = queryTarget('.active-editor')
		if(!editor) return
		const textarea = editor.children.editor
		const resizeTextarea = () => {
			if(!textarea.value) setTextareaHeight('40px')
			else setTextareaHeight('0')
			setTextareaHeight(`${textarea.scrollHeight}px`)
		}
		const setTextareaHeight = valueInPx => textarea.style.height = valueInPx
		tools.keepPositionY(resizeTextarea)
	}
}
function Form() {

    this.submit = async e => {
        const id = targetId(e)
        const inputs = getInputs[id](e.target.elements)
        const errorMessages = this.errorMessages[id]
        try {
            const response = validate.form(inputs, errorMessages) ? await server.postFetch(id, inputs) : ''
            if(!response) throw 'attempt failed'
            if(!['login', 'signUp'].contains(id)) return
            if(!response.user) return
            user = new User(response)
        } catch (error) {
            console.log(error)
        }
    }

    const getInputs = {
        login: el => ({
            email: el.email.value.trim(), 
            password: el.password.value.trim(),
        }),
        signUp: el => ({
            name: el.name.value.trim(), 
            email: el.email.value.trim(), 
            password: el.password.value.trim(), 
            comfirmPw: el.comfirmPw.value.trim(),
        }),
    }
    
    this.errorMessages = ({
        signUp: {
            name: `First and lastname`,
            email: `Must conatin a "@" and a "."`,
            password: `Atleast 8 characters`,
            comfirmPw: 'The passwords doesn\'t match',
        },
        login: {
            email: `Must conatin a "@" and a "."`,
            password: `Your email or password is incorrect`,
        }
    })
}
function Frame(frame) {
	if(!frame) return
	this.getData = () => data
	this.getBoxes = () => boxes
	this.eject = () => queryTarget('#frame').innerHTML = ''

	const data = {
		id: frame.id,
		title: frame.title,
		description: frame.description,
		author: frame.author,
		members: frame.members.map(member => ({
			id: member.id,
			name: member.name,
			profileImgLink: member.profileImgLink,
		})),
	}
	const boxes = frame.boxes.map(box => ({
		id: box.id,
		title: box.title,
		color: box.color,
		tasks: box.tasks.map(task => ({
			id: task.id,
			title: task.title,
			description: task.description,
			color: task.color,
			date: task.date,
			labels: task.labels,
			members: task.members.map(member => member.id),
			subtasks: task.subtasks.map(subtask => ({
				id: subtask.id,
				text: subtask.text,
				member: subtask.member,
			})),
		}))
	}))
	const inject = () => queryTarget('#frame').innerHTML = render.frame()
	//inject()
}
function Render() {
	this.frame = data => themplate.frame(data)
}
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
function Themplates() {
	this.frame = () => `
	
	`
	this.box = () => `
	
	`
	this.card = () => `
	
	`
	this.subtask = () => `
	
	`
}
function Tools() {
	let throttle
	this.getPositionY = () => window.scrollY
	this.keepPositionY = func => {
		y = this.getPositionY()
		func()
		this.scrollToInstantly({top: y})
	}
	this.scrollToInstantly = param => window.scrollTo(param)
	this.throttle = (func, ms) => {
		this.cancelThrottle()
		throttle = setTimeout(() => func(), ms)
	}
	this.cancelThrottle = () => throttle ? clearTimeout(throttle) : ''
	
	this.getSelectedText = element => window.getSelection ? element.value.substring(element.selectionStart, element.selectionEnd) : ''
}
function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User()
		frame = new Frame()
		frame.eject()
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
function Validate() {
    let password

    this.form = (inputs, errorMessages) => {
        for(let key in inputs) {
            if(isInputValid(inputs[key], key)) errorMessages[key] = ''
            announce.formFeedback({[key]: errorMessages[key]})
        }
        password = ''

        for(let key in inputs)
            if(errorMessages[key]) return false
        return true
    }

    this.input = e => {
        const id = targetId(e)
        if(id === 'comfirmPw') return
        const input = e.target.value.trim()
        errorMessages = form.errorMessages[grandParentId(e)]
        
        if(isInputValid(input, id)) 
            errorMessages[id] = ''
        announce.formFeedback({[id]: errorMessages[id]})
    }

	isInputValid = (input, id) => {
		if(id === 'name')
            if(input.split(' ').length < 2) return false
            
		if(id === 'email') {
			if(input.split('@').length !== 2) return false
			if(input.split('.').length !== 2 || !input.split('.')[1]) return false
			if(input.split(/(\W)/).length !== 5) return false
        }

        if(id === 'password') 
            if(input.length < 8) return false
            else password = input

        if(id === 'comfirmPw')
            if(input !== password) return false
            
		return input ? true : false
	}
}