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
    this.login = async e => {
        const el = e.target.elements
        let inputs = {
            email: el.email.value.trim(), 
            password: el.password.value.trim() 
        }
        inputs = testData.login
        const errorMessages = this.errorMessages.login
        const status = validate.isFormValid(e, inputs, errorMessages) ? await server.postFetch('login', inputs) : ''
        console.log(status)
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