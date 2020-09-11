const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const grandParentId = e => e.target.parentElement.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
Array.prototype.contains = function(obj) { return this.indexOf(obj) > -1 }
Array.prototype.removeClass = function(param) {
    this.forEach(item => item.classList.remove(param))
}
String.prototype.replaceBetween = function(content, start, end) { return this.substring(0, start) + content + this.substring(end) }
String.prototype.replaceAt = function(index, replacement) { return this.substr(0, index) + replacement + this.substr(index + replacement.length) }
String.prototype.indicesOf = function(searchStr, caseSensitive) { 
    let str = this
    let searchStrLen = searchStr.length
    if (searchStrLen === 0) {
        return []
    }
    let startIndex = 0, index, indices = []
    if (!caseSensitive) {
        str = str.toLowerCase()
        searchStr = searchStr.toLowerCase()
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index)
        startIndex = index + searchStrLen
    }
    return indices
}

const testData = new TestData()
const tools = new Tools()
const server = new Server()
const cookie = new Cookie()
const themplates = new Themplates()
const render = new Render()
let user = new User()
let frame
let editor
let dragAndDrop = new DragAndDrop()
let contextMenu
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener("input", e => {
    console.log(e.target.type)
    if(e.target.type === 'textarea') tools.resizeAreaToFitContent(e.target)
    if(['signUp', 'login'].contains(grandParentId(e))) validate.input(e)
})
document.addEventListener( "submit", e => {
	e.preventDefault()
    const id = targetId(e)
    if(['signUp', 'login'].contains(id)) form.submit(e)
})

document.addEventListener("click", e => {
    const id = targetId(e)
    if(queryTarget('.active-editor')) editor.deactivate()
    else if(id === 'editor-container') editor = new Editor(e)
    if(contextMenu) {
        if(grandParentId(e) === 'context-menu') {
            const dataType = e.target.parentElement.attributes['data-type']
            if(dataType && frame) frame.CRUD(id, dataType.value, e)
        }
        contextMenu.toggleMenu(false)
    }
    
})
document.addEventListener( 'mousedown', e => {
    const id = targetId(e)
    
    if(['bold', 'italic', 'insertunorderedlist', 'link', 'underline'].contains(id)) {

        // ? why??? e = e || window.event e.preventDefault()
        
        const input = queryTarget('.active-editor').children.editor
        if(id === 'bold') tools.wrapSelectedText(input, '*')
        if(id === 'italic') tools.wrapSelectedText(input, '|')
        if(id === 'underline') tools.wrapSelectedText(input, '_')
    }

    if(queryTarget('.active-editor')) {
        if(id === 'write' && editor.shouldWriteButtonEnable) editor.enableWrite()
        if(id === 'preview') editor.disableWrite()
        if(id === 'save') editor.deactivate()
        if(id === 'cancel') editor.deactivate(true)
    }
})
document.addEventListener( 'contextmenu', e => {
    if(contextMenu) {
        if(!['task', 'box'].contains(targetId(e))) return contextMenu.toggleMenu(false) 
        contextMenu.toggleMenu(false)
    }
    if(!e.target.attributes['data-id']) return
    e.preventDefault()
    if(!contextMenu) {
        contextMenu = new ContextMenu(e)
        contextMenu.toggleMenu(true) 
    }
})
document.addEventListener( 'resize', () => {
    if(!contextMenu) return
    contextMenu.toggleMenu(false)
})