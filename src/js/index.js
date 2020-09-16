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
let frame
let editor
let dragAndDrop
let contextMenu
let user = new User('')
let crud = new CRUD()
const form = new Form()
const validate = new Validate()
const announce = new Announce()

document.addEventListener("input", e => {
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
            if(id === 'update') toggleTextarea(e, true)
            else if(id === 'read') crud.run('read', 'task', e)
            else if(dataType && frame) crud.run(id, dataType.value, e)
        }
        contextMenu.toggleMenu(false)
    } else {
        if(id === 'create') {
            const dataType = e.target.attributes['data-type']
            if(dataType && frame) crud.run(id, dataType.value, e)
        }
        if(queryTarget('textarea.active') && id !== 'textarea') toggleTextarea(e, false)
    }

    if(id === 'task') crud.run('read', id, e)
    else if(id === 'taskShadow') render.eject('.task-container')
    else if(id === 'boxAdd') {
        crud.run('create', 'box', e)
        hoverBetweenBoxes.remove(e)
    }

    if(id === 'dark') toggleDarkmode(true)
    else if(id === 'light') toggleDarkmode(false)
})
document.addEventListener("dblclick", e => {
    const id = targetId(e)
    if(['box', 'frameNav'].includes(id)) toggleTextarea(e, true)
    if(['taskLarge'].includes(parentId(e))) toggleTextarea(e, true)
})
document.addEventListener( 'mousedown', e => {
    const id = targetId(e)
    
    if(['bold', 'italic', 'insertunorderedlist', 'link', 'underline'].includes(id)) {

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
document.addEventListener( 'keydown', e => {
    const key = e.keyCode
    if([13, 27].includes(key)) {
        e.preventDefault()
        if(key == 13) toggleTextarea(e, false, true) //key 13 enter
        if(key === 27) toggleTextarea(e, false) //key 27 esc
    }
    if(parentId(e) === 'frameNav') 
        if(e.target.value.length > 33 && ![8,16,17,37,38,39,40].includes(key)) e.preventDefault() //8 backspace & 16 shift & 17 ctrl & 37,38,39,40 arrowkeys
})
document.addEventListener( 'contextmenu', e => {
    const id = targetId(e)
    if(contextMenu) {
        if(!['task', 'box', 'frame', 'frameNav'].includes(id)) return contextMenu.toggleMenu(false) 
        contextMenu.toggleMenu(false)
    }
    if(!e.target.attributes['data-id'] || id === 'taskLarge') return
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

const hoverBetweenBoxes = {
    add: e => {
        tools.throttle(function() {e.target.classList.add('hover')}, 300)
    },
    remove: e => {
        tools.cancelThrottle()
        e.target.classList.remove('hover')
    },
}
document.addEventListener("mouseover", e => {
    const id = targetId(e)
    if(id === "boxAdd") hoverBetweenBoxes.add(e)
})
document.addEventListener("mouseout", e => {
    const id = targetId(e)
    if(id === "boxAdd") {
        hoverBetweenBoxes.remove(e)
    }
})










function toggleDarkmode(bool) {
    const targets = [queryTarget('body'), queryTarget('#frame'), queryTarget('.darkModeToggle')]
    targets.forEach(target => {
        bool ? target.classList.remove('light') : target.classList.add('light')
    })
}

function hide() {
    ;[queryTarget('#signUp'), queryTarget('#login'), queryTarget('#editor-container')].forEach(target => {
        target.style.display = 'none'
    })
}
function show() {
    ;[queryTarget('#signUp'), queryTarget('#login'), queryTarget('#editor-container')].forEach(target => {
        target.style.display = 'block'
    })
}