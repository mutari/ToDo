const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }
String.prototype.replaceBetween = function(content, start, end) { return this.substring(0, start) + content + this.substring(end) }

const testData = new TestData()
const tools = new Tools()
const server = new Server()
const cookie = new Cookie()
let user = new User()
let frame
let editor
const form = new Form()
const validate = new Validate()
const announce = new Announce()
const themplates = new Themplates()

document.addEventListener("input", e => {
    console.log(e.target.type)
    if(e.target.type === 'textarea') tools.resizeAreaToFitContent(e.target)
    if(['signUp', 'login'].contains(grandParentId(e))) validate.input(e)
})
document.addEventListener( "submit", e => {
    const id = targetId(e)
	e.preventDefault()
    if(['signUp', 'login'].contains(id)) form.submit(e)
})

document.addEventListener("click", e => {
    const id = targetId(e)
    if(queryTarget('.active-editor')) editor.deactivate()
    else if(id === 'editor-container') editor = new Editor(e)
})
document.addEventListener( 'mousedown', e => {
    const id = targetId(e)
    
    if(['bold', 'italic', 'insertunorderedlist', 'link', 'underline'].contains(id)) {

        // ? why??? e = e || window.event; e.preventDefault()
        
        const input = queryTarget('.active-editor').children.editor
        if(id === 'bold') tools.wrapSelectedText(input, '*')
        if(id === 'italic') tools.wrapSelectedText(input, '|')
        if(id === 'underline') tools.wrapSelectedText(input, '_')
    }

    if(queryTarget('.active-editor')) {
        if(id === 'write') editor.enableWrite()
        if(id === 'preview') editor.disableWrite()
        if(id === 'save') editor.deactivate()
        if(id === 'cancel') editor.deactivate(true)
    }
    
})