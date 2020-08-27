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