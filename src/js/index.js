const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.match = function(arr) { return arr.map( obj => this.indexOf(obj) > -1) }

const testData = new TestData()
const editor = new Editor()
let user = new User()
let frame
const server = new Server()
const cookie = new Cookie()
testData.cookie()
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(['signUp', 'login'].match([id])) form.submit(e)
})
document.addEventListener("input", e => ['signUp', 'login'].match(grandParentId(e)) ? validate.input(e) : '')

document.addEventListener("click", e => {
    const id = targetId(e)
    editor.deactivate(e)
})
;[...queryTargetAll('#editor-container')].map(container => {
    container.addEventListener('click', e => {
        e.stopPropagation()
        if(e.target !== document) {
            parentId(e) === 'editor-container' ? editor.activate(e) : ''
        }
    })
})