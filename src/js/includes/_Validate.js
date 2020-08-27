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