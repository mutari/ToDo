const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }

const testData = new TestData()
let login = new Login()
let frame
const server = new Server()
const cookie = new Cookie()
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(['signUp', 'login'].contains(id)) form.submit(e)
})
document.addEventListener("input", e => validate.input(e))