const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }

const testData = new TestData()
const tools = new Tools()
const editor = new Editor()
let user = new User()
let frame
const server = new Server()
const cookie = new Cookie()
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener("input", e => {
    if(e.target.type === 'textarea') editor.resizeTextareaToFitContent(e)
    if(['signUp', 'login'].contains(grandParentId(e))) validate.input(e)
})
document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(['signUp', 'login'].contains(id)) form.submit(e)
})

document.addEventListener("click", e => {
    if(!queryTarget('.active-editor')) return
    editor.format()
    editor.deactivate()
})
;[...queryTargetAll('#editor-container')].map(container => {
    container.addEventListener('click', e => {
        e.stopPropagation()
        if(e.target !== document) {
            const id = targetId(e)
            if(parentId(e) === 'editor-container') editor.activate(e)
        }
    })
})
document.onmousedown = function(e){
    const id = targetId(e)
    if(!['bold', 'italic', 'insertunorderedlist', 'link', 'underline'].contains(id)) return
    e = e || window.event
    e.preventDefault()
    if(id === 'bold') editor.wrapSelectedText('*')
    if(id === 'italic') editor.wrapSelectedText('|')
    if(id === 'underline') editor.wrapSelectedText('_')
}