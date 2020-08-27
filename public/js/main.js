const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)

const testData = new TestData()
const server = new Server()
const validate = new Validate()
const announce = new Announce()
const form = new Form()
// server.postFetch('login', {"hej": 'hejdå'})


document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(id === 'signUp') form.signUp(e)
    if(id === 'login') form.login(e)
})
document.addEventListener("input", e => { 
	validate.isFormValid(e)
})
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
}
function Announce() {
    this.formFeedback = errorMessages => {
		for(let key in errorMessages)
			errorMessages[key] ? inputError(errorMessages[key], key) : inputSuccess(key)
    }
    inputSuccess = id => console.log('success', id)
    inputError = (message, id) => console.log(message, id)
}
function Form() {
    this.signUp = e => {
        const el = e.target.elements
        const inputs = {  
            name: el.name.value.trim(), 
            email: el.email.value.trim(), 
            password: el.password.value.trim(), 
            comfirmPw: el.comfirmPw.value.trim()
        }
        const errorMessages = this.errorMessages.signUp
        validate.isFormValid(e, input, errorMessages) ? console.log('frontend-signUp-valid') : '' //server.postFetch(dest, inputs)
    }
    this.login = e => {
        const el = e.target.elements
        const inputs = {
            email: el.email.value.trim(), 
            password: el.password.value.trim() 
        }
        const errorMessages = this.errorMessages.login
        validate.isFormValid(e, inputs, errorMessages) ? server.postFetch('login', inputs) : ''
    }
    this.reset = e => {
		queryTarget(`${targetId(e)}`).reset()
    }
    this.errorMessages = {
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
    }
}
function Server() {
	this.data
	const url = {
		init: "",
		signUp: "",
		login: "/login",
	}
	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	this.initFetch = async logedInUser => {
		if(this.data) return
		this.postFetch(url.init, postOption(logedInUser))
	}
    this.postFetch = async (dest, data) => {
		try {
			if(!dest) throw 'no destination given on postFetch'
			if(!data) throw 'no data given on postFetch'
			console.log(url[dest], dest)
			return (await fetch(url[dest], postOption(data))).json()
		} catch (error) {
			console.log(error)
		}
	}

}
function Validate() {
    let password
    this.isFormValid = (e, inputs, error) => {
        const id = targetId(e)
        let errorMessages = error

		if(e.type !== 'submit') {
            errorMessages = form.errorMessages[grandParentId(e)]
            const input = e.target.value.trim()
            
			if(this.isInputValid(input, id)) (errorMessages[id] = '')
            announce.formFeedback({[id]: errorMessages[id]})
            
		} else if(e.type === 'submit') {

			for(let key in inputs) {
				if(this.isInputValid(inputs[key], key)) errorMessages[key] = ''
				announce.formFeedback({[key]: errorMessages[key]})
            }
            password = ''

			for(let key in inputs)
                if(errorMessages[key]) return false
            return true
		}
	}
	this.isInputValid = (input, id) => {
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