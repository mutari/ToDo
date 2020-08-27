function Announce() {
    this.formFeedback = errorMessages => {
		for(let key in errorMessages)
			errorMessages[key] ? inputError(errorMessages[key], key) : inputSuccess(key)
    }
    inputSuccess = id => console.log('success', id)
    inputError = (message, id) => console.log(message, id)
}