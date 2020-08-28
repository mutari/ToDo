function Form() {
    this.signUp = e => {
        const el = e.target.elements
        let inputs = {  
            name: el.name.value.trim(), 
            email: el.email.value.trim(), 
            password: el.password.value.trim(), 
            comfirmPw: el.comfirmPw.value.trim()
        }
        inputs = testData.signUp1
        const errorMessages = this.errorMessages.signUp

        requestHandler(e, inputs, errorMessages, 'signUp')
    }
    this.login = e => {
        const el = e.target.elements
        let inputs = {
            email: el.email.value.trim(), 
            password: el.password.value.trim() 
        }
        inputs = testData.login
        const errorMessages = this.errorMessages.login

        requestHandler(e, inputs, errorMessages, 'login')
    }

    this.reset = e => {
		queryTarget(`${targetId(e)}`).reset()
    }
    requestHandler = async (e, inputs, errorMessages, type) => {
        try {
            const status = validate.isFormValid(e, inputs, errorMessages) ? await server.postFetch(type, inputs) : ''
            console.log(status)
        } catch (error) {
            console.log(error)
        }
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