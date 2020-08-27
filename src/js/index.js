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