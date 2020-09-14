function Announce() {
    this.formFeedback = errorMessages => {
      for(let key in errorMessages)
        errorMessages[key] ? inputError(errorMessages[key], key) : inputSuccess(key)
    }
    const inputSuccess = id => console.log('success', id)
    const inputError = (message, id) => console.log(message, id)
}