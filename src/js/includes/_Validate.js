function Validate() {
    let password
    this.hasScrollbar = target => target.scrollHeight > target.clientHeight

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
        const errorMessages = form.errorMessages[grandParentId(e)]
        
        if(isInputValid(input, id)) 
            errorMessages[id] = ''
        announce.formFeedback({[id]: errorMessages[id]})
    }

	function isInputValid(input, id) {
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
    
    this.status = (status) => { // 200 = all okej, 400 = did not find data, 500 = server fucked up
        return !(status <= 200 && status >= 0) // flase = successfull true = failed
    } 
}