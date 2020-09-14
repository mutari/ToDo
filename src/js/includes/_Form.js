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
            password: el.pw.value.trim(),
        }),
        signUp: el => ({
            name: el.name.value.trim(), 
            email: el.email.value.trim(),
            password: el.pw.value.trim(), 
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