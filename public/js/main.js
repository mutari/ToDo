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
    if(parentId(e) === 'taskLarge') toggleTextarea(e, true)
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
function TestData() {
    this.login = {
        email: 'test123@test123.se',
        password: 'aaaaaaaa' 
    }
    
    this.signUp1 = { //complete success
        name: 'Egyuik wewewe',
        email: 'test123@test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp2 = { // invaidname and email (misses "."), password too short and doesn't match comfirm
        name: 'Egyuik',
        email: 'test123@test123se',
        password: 'aaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp3 = { // invaidname and email (misses "@"), comfirm doesn't match password
        name: 'Egyuik',
        email: 'test123test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaa',
    }
    this.cookie = () => { // true; hej; false;
        cookie.create('name', 'hej', 5)
        console.log(cookie.check('name'))
        console.log(cookie.get('name'))
        cookie.destroy('name')
        console.log(cookie.check('name'))
    }
    this.frameJson = {
        title: "My first board",
        description: "My first board",
        author: "",
        timestampCreated: "",
        timestampUpdated: "",
        members: [],
        boxes: [
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
        ],
    }
}
async function toggleTextarea(e, state, save) {
    if(state) {
        dragAndDrop.stopDndOfActiveTextarea = true
        const parent = contextMenu ? contextMenu.extractTarget()
            : queryTarget(`[data-id="${e}"]`) ? queryTarget(`[data-id="${e}"]`)
            : parentId(e) === 'taskLarge' ? e.target.parentElement
            : e.target

        console.log(parent)
        const textarea = parent.children.textarea
        toggle(textarea, state)
        frame.previousText = textarea.value
        frame.previousType = parent.id
    } else {
        const textarea = queryTarget('textarea.active')
        try {
            if(save) {
                const type = frame.previousType
                await crud.run('update', type)
                textarea.innerHTML = textarea.value
                if(type === 'taskLarge') queryTarget(`.task[data-id="${textarea.parentElement.attributes['data-id'].value}"]`).children.textarea.innerHTML = textarea.value
            }
            toggle(textarea, state)
        } catch (error) {
            console.log(error)
            toggle(textarea, false)
        }
    }

    function toggle(textarea, state) {
        const parent = textarea.parentElement
        toggleDraggability(state)
        textarea.readOnly = !state
        state ? reveal() : hide()
        tools.resizeAreaToFitContent(textarea)
        
        function reveal() {
            if(queryTarget('textarea.active')) toggleTextarea()
            tools.focusAndputCursorAtEnd(textarea)
            textarea.classList.add('active')
        }
        function hide() {
            !save ? textarea.value = frame.previousText : ''
            textarea.blur()
            textarea.classList.remove('active')
        }
        function toggleDraggability() {
            if(['task', 'box'].includes(parent.id)) parent.draggable = !state
            if(parent.id === 'task') parent.parentElement.draggable = !state
            textarea.draggable = !state
        }
    }
}
function Announce() {
    this.formFeedback = errorMessages => {
      for(let key in errorMessages)
        errorMessages[key] ? inputError(errorMessages[key], key) : inputSuccess(key)
    }
    inputSuccess = id => console.log('success', id)
    inputError = (message, id) => console.log(message, id)
}
function ContextMenu(e) {
    const type = [...e.target.classList].find(type => [ 'frameNav', 'frame', 'box', 'task'].includes(type))
    
    render.contextMenu(e.target.attributes['data-id'].value, type)
    const menu = queryTarget('#context-menu')

    this.toggleMenu = state => {
        if(!state) {
            menu.classList.remove('active')
            menu.remove()
            contextMenu = undefined
        } else if(state) {
            contextMenu.positionMenu(e)
            menu.classList.add('active')
        }
    }

    this.positionMenu = (e) => {
        const {posX, posY} = tools.getPositionOfEvent(e)
        tools.positionAbsoluteBoxAt(menu, posX, posY)
    }
    this.extractTarget = () => {
        const ulTag = menu.children[0]
        const id = ulTag.attributes['data-id'].value
        const type = ulTag.attributes['data-type'].value
		return queryTarget(`.${type}[data-id*="${id}"]`)
    }
}
function Cookie() {
	this.destroy = key => this.create(key,"",-1)
	this.check = key => this.get(key) ? true : false
	this.create = async (key, value, days) => {
		let expires = days ? experationDate(days) : ''
		document.cookie = `${key}=${value}${expires}; path=/`
	}
	this.get = key => {
		key = `${key}=`
		var content = document.cookie.split(';')
		for(info of content) {
			while (info.charAt(0) == ' ')
				info = info.substring(1)
			if (info.indexOf(key) == 0)
				return info.substring(key.length, info.length)
		}
		return ''
	}
	
	const experationDate = days => {
		const date = new Date()
		date.setTime(date.getTime()+(days*24*60*60*1000))
		return`; expires=${date.toGMTString()}`
	}
}
function CRUD() {
    this.run = async (method, type, e) => {
        console.log(method)
        try {
            if(!frame.getData()) return
            let input = this.getData(method, type, e)
            if(!input) throw 'No input where gathered'
            console.log(input)
    
            if(method !== 'read') {
                const response = await server.postFetch(method, {type, ...input, token: cookie.get('token')})
                if(validate.status(response.status) || !response.status) throw ''
        
                if(method === 'create') {
                    if(!response.id) throw 'No server response on creation request'
                    input = {...input, createdId: response.id}
                }
                if(['create', 'update'].includes(method)) updateStoredValues(method, type, input)
            }
    
            return this.DOMHandler(method, type, input)
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    this.getData = function(method, type, e) {
        let data, textarea, target, ids

        if(contextMenu) {
            target = contextMenu.extractTarget(e)
            if(type === 'task') data = {domType: 'taskLarge'}
        } else if(method === 'read') {
            target = e.target
            const domType = type === 'task' ? 'taskLarge' : type
            data = {domType}
        } else if(method === 'update') {
            textarea = queryTarget('#textarea.active')
            if(type === 'taskLarge')  target = queryTarget(`.task[data-id="${textarea.parentElement.attributes['data-id'].value}"]`)
            else target = textarea.parentElement
            const id = target.id
            type = id === 'frameNav' ? 'frame' 
                : id === 'taskLarge' ? 'task'
                : id
            data = {data: {text: textarea.value}, type}
        } else if(method === 'create') {
            if(type === 'task') {
                target = e.target.parentElement
                type = 'box'
            } else if(type === 'box') {
                data =  tools.ifAttributesGetValues({idToRenderAt: e.target.parentElement.attributes['data-id']})
                target = e.target.parentElement.parentElement
                type = 'frame'
            }
        }
        
        if(type === 'task') ids = {...ids, boxId: target.parentElement.attributes['data-id'], frameId: target.parentElement.parentElement.attributes['data-id']}
        if(type === 'box') ids = {...ids, frameId: target.parentElement.attributes['data-id']}
        ids = {...ids, id: target.attributes['data-id']}
        data = {...tools.ifAttributesGetValues(ids), ...data}
        
        return (!data || (data.data && data.data.text === frame.previousText)) ? '' : data //return '' if no change on update
    }
    
    this.DOMHandler = function(method, type, input) {
        switch (method) {
            case 'create':
                if(type === 'frame') {
                    if(response.frame) frame = new Frame(response.frame) //! fake
                } else if(type === 'task') render[type](input)
                else if(['box', 'subtask'].includes(type)) render[type](input)
                break
            case 'read': //! fake
                if(type === 'frame') {
                    if(response.frame) frame = new Frame(response.frame)
                } else if(type === 'task') render[`${input.domType}`](input)
                else if(['box', 'subtask'].includes(type)) if(response[type]) render[type](input)
                break
            case 'update':
                break
            case 'delete':
                if(type === 'frame') frame = new Frame()  //! fake?
                else if(['box', 'task', 'subtask'].includes(type)) render.eject(`.${type}[data-id="${input.id}"]`)
                break
        }
        return Promise.resolve()
    }

    function updateStoredValues(method, type, input) {
        if(method === 'create') frame.addTask({id: input.createdId, boxId: input.id})
        if(method === 'update') frame.updateTask({id: input.id, boxId: input.boxId, data: input.data})
    }
}
function DragAndDrop() {
    let dragSrcEl = null
    let dragType = false
    let cancelLeave
    
    this.frame = queryTarget('.frame')
    this.tasks = () => [...queryTargetAll('.box .task')]
    this.boxes = () => [...queryTargetAll('.frame .box')]
    
    this.handleDragStart = e => {
        if(queryTarget('textarea.active')) toggleTextarea(e, false)
        dragSrcEl = e.target
        dragType = e.target.id
        e.target.style.opacity = '0.4'
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', e.target.innerHTML)
    }
    
    this.handleDragOver = e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }
    
    this.handleDragEnter = e => {
        if(dragType === 'box')
            dragSrcEl.id !== e.target.id ? e.target.parentElement.classList.add('over') : e.target.classList.add('over')
        else if(dragType === 'task')
            if(dragSrcEl.id === e.target.id) e.target.classList.add('over')
        if(e.target.id === 'task') cancelLeave = true
    }
    
    this.handleDragLeave = e => {
        if(dragType === 'box') {
            if(e.target.id === 'box' && !cancelLeave)
                this.boxes().removeClass('over')
        } else if(dragType === 'task') {
            e.target.classList.remove('over')
        }
        cancelLeave = false
    }
    
    this.handleDrop = e => {
        e.stopPropagation()
        const srcHTML = e.dataTransfer.getData('text/html')
        if(dragType === 'box' && dragSrcEl.id === e.target.parentElement.id && e.target.parentElement) {
            dragSrcEl.innerHTML = e.target.parentElement.innerHTML
            e.target.parentElement.innerHTML = srcHTML
        } else if(dragType === 'box' || (dragType === 'task' && dragSrcEl.id === e.target.id)) {
            dragSrcEl.innerHTML = e.target.innerHTML
            e.target.innerHTML = srcHTML
        } else if(dragType === 'task' && e.target.id === 'box') {
            dragSrcEl.style.opacity = 1
            e.target.insertAdjacentHTML('beforeend', dragSrcEl.outerHTML)
            dragSrcEl.remove()
        }
    }
    
    this.handleDragEnd = e => {
        e.target.style.opacity = 1
        dragSrcEl.style.opacity = 1
        this.tasks().removeClass('over')
        this.boxes().removeClass('over')
    }
    
    const addDndEventListener = frame => {
        frame.addEventListener('dragstart', this.handleDragStart, false)
        frame.addEventListener('dragenter', this.handleDragEnter, false)
        frame.addEventListener('dragover', this.handleDragOver, false)
        frame.addEventListener('dragleave', this.handleDragLeave, false)
        frame.addEventListener('drop', this.handleDrop, false)
        frame.addEventListener('dragend', this.handleDragEnd, false)
    }
    addDndEventListener(this.frame)
}
function Editor(e) {
	if(!e) return
	const container = e.target
	const textarea = container.children.editor
	const formatedArea = container.children.formatedContent
	let previousText = textarea.value
	let beforeWrite
	this.shouldWriteButtonEnable = false

	this.activate = () => container.classList.add('active-editor')
	this.deactivate = cancel => {
		const editorContainer = container
		if(!cancel) {
			this.format(textarea.value)
			tools.setAreaHeight(textarea)
		} else {
			textarea.value = previousText
			formatedArea.classList.remove('editor')
		}
		editorContainer.classList.remove('active-editor')
		container.removeEventListener('click', containerOnClick)
	}

	this.disableWrite = () => {
		this.shouldWriteButtonEnable = true
		beforeWrite = textarea.value
		this.format(beforeWrite)
		textarea.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.enableWrite = () => {
		textarea.value = beforeWrite
		formatedArea.innerHTML = previousText
		textarea.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	this.format = text => {
		text = tools.removeBlacklistedChars(text, blacklist)
		textarea.value = text
		formatedArea.innerHTML = tools.replaceAllRequestedSymbolsWithSpanTags(text, symbolStyling)
	}

	const symbolStyling = [
		{
			symbol: '*',
			class: 'bold',
		},
		{
			symbol: '|',
			class: 'italic',
		},
		{
			symbol: '_',
			class: 'underline',
		},
		{
			symbol: '~',
			class: 'strikeThrough',
		},
	]
	const blacklist = [`<`, `>`, `'`, `"`, '`']
	const containerOnClick = e => {
		e.stopPropagation()
		this.activate()
		tools.resizeAreaToFitContent(textarea)
	}
	container.addEventListener('click', containerOnClick);

	this.activate()
}
function Form() {

    this.submit = async e => {
        const id = targetId(e)
        const inputs = getInputs[id](e.target.elements)
        const errorMessages = this.errorMessages[id]

        try {
            const response = validate.form(inputs, errorMessages) ? await server.postFetch(id, inputs) : ''
            if(!response) throw 'attempt failed'
            if(!['login', 'signUp'].contains(id)) return
            if(!response.user) return
            user = new User(response)
        } catch (error) {
            console.log(error)
        }
    }

    const getInputs = {
        login: el => ({
            email: el.email.value.trim(), 
            password: el.pw.value.trim(),
        }),
        signUp: el => ({
            name: el.name.value.trim(), 
            email: el.email.value.trim(),
            password: el.pw.value.trim(), 
            comfirmPw: el.comfirmPw.value.trim(),
        }),
    }
    
    this.errorMessages = ({
        signUp: {
            name: `First and lastname`,
            email: `Must conatin a "@" and a "."`,
            password: `Atleast 8 characters`,
            comfirmPw: 'The passwords doesn\'t match',
        },
        login: {
            email: `Must conatin a "@" and a "."`,
            password: `Your email or password is incorrect`,
        }
    })
}
function Frame(frame) {
	this.previousText
	this.previousType
	if(!frame) return queryTarget('#render').innerHTML = ''
	
	this.getData = () => data
	this.getBoxes = () => boxes
	
	this.addTask = data => boxes.filter(box => parseInt(data.boxId) === box.id)[0]
		.tasks.push({id: data.id})

	this.updateTask = data => {
		let task = boxes.filter(box => parseInt(data.boxId) === box.id)[0]
			.tasks.filter(task => parseInt(data.id) === task.id)[0]

		for(key in data.data) Object.assign(task, {[key]: data.data[key]})
	}
	

	const data = {
		id: frame._id,
		title: frame.title,
		description: frame.description,
		author: frame.author,
		members: frame.members.map(member => ({
			id: member.id,
			name: member.name,
			profileImgLink: member.profileImgLink,
		})),
	}
	let boxes = frame.boxes.map(box => ({
		id: box.id,
		title: box.name,
		color: box.color,
		tasks: box.tasks.map(task => ({
			id: task.id,
			text: task.text,
			description: task.description,
			color: task.color,
			date: task.date,
			labels: task.labels,
			members: task.members.map(member => member.id),
			subtasks: task.subtasks.map(subtask => ({
				id: subtask.id,
				text: subtask.text,
				member: subtask.member,
			})),
		})),
	}))
	
	init()
	async function init() {
		try {
			await render.frame({data, boxes})
			dragAndDrop = new DragAndDrop()
			// toggleLoadingscreen()
		} catch (error) {
			console.log(error)
		}
	}
}
function Render() {
	this.frame = async data => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#render').innerHTML = themplates.frame(data)
			return Promise.resolve()
		}
	}
	this.box = async data => {
		console.log('hej')
		await renderBox()
		toggleTextarea(5, true)
		return Promise.resolve()
		
		function renderBox() {
			queryTarget(`.box[data-id="${data.idToRenderAt}"`).insertAdjacentHTML('afterend', themplates.box({id: 5, title: ' '}))
			return Promise.resolve()
		}
	}
	this.taskLarge = async (data) => {
		const boxes = frame.getBoxes()
		console.log(boxes,data)
		const box = boxes.find(box => box.id === parseInt(data.boxId))
		const task = {...box.tasks.find(task => task.id === parseInt(data.id)), parent: box.title}
		await renderTaskLarge()
		tools.resizeAreaToFitContent(queryTarget(`.taskLarge[data-id="${task.id}"`).children.textarea)
		return Promise.resolve()

		function renderTaskLarge() {
			queryTarget(`#render`).insertAdjacentHTML('beforeend', themplates.taskLarge(task))
			return Promise.resolve()
		}
	}
	this.task = async data => {
		await renderTask()
		toggleTextarea(data.createdId, true)
		return Promise.resolve()

		function renderTask() {
			queryTarget(`.box[data-id="${data.id}"]`).insertAdjacentHTML('beforeend', themplates.task({id: data.createdId, text: ' '}))
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.eject = param => queryTarget(param).remove()
 }
function Server() {
	this.fetch = async dest => {
		try {
			if(!dest) throw 'no destination given on fetch'
			let response = await fetch(getUrl(dest))
			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}
    this.postFetch = async (dest, data) => {
		try {
			if(!dest) throw 'no destination given on postFetch'
			if(!data) throw 'no data given on postFetch'
			let response = await fetch(getUrl(dest), postOption(data))
			return await response.json()
		} catch (error) {
			console.log(error)
		}
	}

	const action = {
		signUp: "/signUp",
		login: "/login",
		user: "/user",
		create: "/frame/create",
		read: "/frame/read",
		update: "/frame/update",
		delete: "/frame/delete",
	}

	const postOption = data => ({
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	})
	const getUrl = dest => `ToDo${action[dest]}` //http://98.128.142.46/
}
function Themplates() {
	this.frame = frame => `
		<nav class="frameNav" id="frameNav" data-id="${frame.data.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="2">${frame.data.title}</textarea>
		</nav>
		<div class="frame" id="frame" data-id="${frame.data.id}">${frame.boxes ? frame.boxes.map(box => this.box(box)).join('') : ''}</div>
	`
	this.box = box => `
		<ul class="box" id="box" draggable="true" data-id="${box.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${box.title}</textarea>
			<button id="create" data-type="task">+</button>
			${box.tasks ? box.tasks.map(task => this.task(task)).join('') : ''}
			<span id="boxAdd" data-partnerId="${box.id}" />
		</ul>
	`
	this.task = task => `
		<li class="task" id="task" draggable="true"  data-id="${task.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${task.text}</textarea>
		</li>
	`
	this.taskLarge = task => `
		<div class="task-container">
			<div class="taskLarge" id="taskLarge"  data-id="${task.id}">
				<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${task.text ? task.text : ''}</textarea>
				<p>In <b>${task.parent}</b></p>
				<div></div>
				${task.description ? this.editor(task.description) : ''}
			</div>
			<span id="taskShadow"></span>
		</div>
	`
	this.subtask = () => `
	
	`
	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">
			<ul data-id="${id}" data-type="${type}">
				${!['frame', 'frameNav'].includes(type) ? '<li id="read">View</li>' : ''}
				${type === 'box' ? '<li id="create">Add</li>' : ''}
				<li id="update">Edit</li>
				${!['frame', 'frameNav'].includes(type) ? '<li id="delete">Delete</li>' : ''}
			</ul>
		</nav>
	`

	this.editor = description => `
		<div class="editor-container" id="editor-container">
			<div class="toolbar">
				<div>
					<button id="write">Write</button>
					<button id="preview">Preview</button>
				</div>
				<div>
					<a class="fa fa-bold fa-fw" id="bold" unselectable="on"></a>
					<a class="fa fa-italic fa-fw" id="italic"></a>
					<a class="fa fa-underline fa-fw" id="underline"></a>
					<a class="fa fa-list fa-fw" id="list"></a>
					<a class="fa fa-link fa-fw" id="link"></a>
				</div>
			</div>
			<textarea class="editor" id="editor" spellcheck="false" data-enablewrite="true">${description}</textarea>
			<p id="formatedContent"></p>
			<div class="optionbar">
				<button id="save">Save</button><button id="cancel">Cancel</button>
			</div>
		</div>
	`
}
function Tools() {
	let throttle
	this.getPositionY = () => window.scrollY
	this.keepPositionY = func => {
		y = this.getPositionY()
		func()
		this.scrollToInstantly({top: y})
	}
	this.scrollToInstantly = param => window.scrollTo(param)
	this.throttle = (func, ms) => {
		this.cancelThrottle()
		throttle = setTimeout(() => func(), ms)
	}
	this.cancelThrottle = () => throttle ? clearTimeout(throttle) : ''
	
	this.getSelectedText = element => window.getSelection ? [
		element.value.substring(element.selectionStart, element.selectionEnd), 
		element.selectionStart, 
		element.selectionEnd
	] : ''

	this.wrapSelectedText = (input, symbol) => {
		if(!input.dataset.enablewrite) return
		const [selectedText, startIndex, endIndex] = this.getSelectedText(input)
		input.value = input.value.replaceBetween(`${symbol}${selectedText}${symbol}`, startIndex, endIndex)
	}

	this.replaceAllRequestedSymbolsWithSpanTags = (input, translations) => {
		let output = ''
		let classes
		let notSymbol = true
		const charArr = input.split('')
		const setActiveClasses = () => translations.map(translation => translation.live ? classes += `${translation.class} ` : '')

		charArr.map(char => {
			notSymbol = true
			translations.map(data => {
				if(char !== data.symbol) return
				notSymbol = false
				classes = ''

				if(!data.live) {
					setActiveClasses()
					data.live = true
				} else {
					data.live = false
					setActiveClasses()
				}

				if(classes) {
					if(data.live) classes += data.class
					output += `</span><span class="${classes}">`
				} else if(data.live) output += `<span class="${data.class}">`
				else output += `</span>`
			})
			if(notSymbol) output += char
		})
		return output
	}

	this.removeBlacklistedChars = (text, blacklist) => {
		const threatsToRemove = blacklist.map(threat => text.indicesOf(threat))
		threatsToRemove.forEach(indices => indices.forEach(index => text = text.replaceAt(index, ' ')))
		return text
	}

	this.resizeAreaToFitContent = targetEl => {
		const area = targetEl
		if(!area) return
		const resizeTextarea = () => {
			if(!area.value) this.setAreaHeight(targetEl, '18px')
			else this.setAreaHeight(targetEl, '')
			this.setAreaHeight(targetEl, `${area.scrollHeight}px`)
		}
		this.keepPositionY(resizeTextarea)
	}
	this.setAreaHeight = (targetEl, valueInPx) => targetEl.style.height = valueInPx

	this.getPositionOfEvent = e => {
		let posX, posY
	
		e = !e ? e = window.event : e
		
		if (e.pageX || e.pageY) {
		  posX = e.pageX
		  posY = e.pageY
		} else if (e.clientX || e.clientY) {
		  posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
		  posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
		}
	
		return {
		  posX: posX,
		  posY: posY
		}
	}
	this.positionAbsoluteBoxAt = (target, x, y) => {
        targetWidth = target.offsetWidth + 4
        targetHeight = target.offsetHeight + 4
        documentWidth = document.innerWidth
        documentHeight = document.innerHeight

        target.style.left = ((documentWidth - x) < targetWidth) ? `${documentWidth - targetWidth}px` : `${x}px`
        target.style.top = ((documentHeight - y) < targetHeight) ? `${documentHeight - targetHeight}px` : `${y}px`
	}
	
	this.ifAttributesGetValues = (ids) => {
		let arr
		for(id in ids)
			arr = ids[id] ? {...arr, [id]: ids[id].value} : ''
		return arr.length === ids.length ? arr : ''
	}

	this.focusAndputCursorAtEnd = target => {
		if(document.activeElement !== target) target.focus()
		let len = target.value.length * 2
		
		setTimeout(function() {
		target.setSelectionRange(len, len);
		}, 1)
		target.scrollTop = 999999
	}
}

function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User('')
		frame = new Frame()
	}

	this.changeFrame = () => {
		
	}
	
	init(datas)
	async function init(datas) {
		if(datas) {
			hide()
			if(datas.frame) frame = new Frame(datas.frame)
			if(datas.token) cookie.create('token', datas.token, 365)
			const loadingscreen = queryTarget('.loadingscreen')
			if(loadingscreen) loadingscreen.remove()
			data = {
				id: datas.user._id,
				name: datas.user.name,
				email: datas.user.email,
			}
			frames = datas.user.frames.map(frame => ({
				id: frame.id,
				title: frame.id,
			}))
		} else {
			try {
				if(cookie.check('token')) datas = await server.postFetch('user', {token: cookie.get('token')})
				if(!datas) throw ''
				user = new User(datas)
			} catch (error) {
				window.show()
				const loadingscreen = queryTarget('.loadingscreen')
				if(loadingscreen) loadingscreen.remove()
				console.log(error)
			}
		}
	}
}
function Validate() {
    let password

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
        errorMessages = form.errorMessages[grandParentId(e)]
        
        if(isInputValid(input, id)) 
            errorMessages[id] = ''
        announce.formFeedback({[id]: errorMessages[id]})
    }

	isInputValid = (input, id) => {
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
        return !(status <= 200 && status >= 0)
    } 
}