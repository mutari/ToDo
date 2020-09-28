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
String.prototype.indicesOf = function(searchStr, caseSensitive, startIndex) { 
    let str = this
    let searchStrLen = searchStr.length
    if (searchStrLen === 0) {
        return []
    }
    startIndex = startIndex ? startIndex : 0
    let index, indices = []
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

const tools = new Tools()
const server = new Server()
const cookie = new Cookie()
const themplates = new Themplates()
const render = new Render()
let frame
let editor
let dragAndDrop
let contextMenu
let dropdown
const validate = new Validate()
let user = new User('')
const crud = new CRUD()
let form = new Form()
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

    if(queryTarget('.dropdown')) {
        if(parentId(e) === 'colorList') crud.run({method: 'update', type: 'task', data: {color: id}})
    }
    
    if(['colorBtn', 'membersBtn', 'labelsBtn'].includes(id)) {
        if(queryTarget('.dropdown')) dropdown.deactivate()
        const taskLarge = id === 'colorBtn' ? e.target.parentElement.parentElement : e.target.parentElement.parentElement.parentElement
        dropdown = new Dropdown(e, id, taskLarge.attributes['data-id'].value)
    } else if(dropdown) dropdown.deactivate()
    
    if(contextMenu) {
        if(grandParentId(e) === 'context-menu') {
            const dataType = e.target.parentElement.attributes['data-type']
            if(id === 'update') toggleTextarea(e, true)
            else if(id === 'read') crud.run({method: 'read', type: 'task', e})
            else if(dataType && frame) crud.run({method: id, type: dataType.value, e})
        }
        contextMenu.toggleMenu(false)
    } else {
        if(id === 'create') {
            const dataType = e.target.attributes['data-type']
            if(dataType && frame) crud.run({method: id, type: dataType.value, e})
        }
        if(queryTarget('textarea.active') && id !== 'textarea') toggleTextarea(e, false)
    }

    if(id === 'task') crud.run({method: 'read', type: id, e})
    else if(id === 'taskLarge-container') render.eject(`#${id}`)
    else if(id === 'boxAdd' && queryTarget('.hover')) {
        crud.run({method: 'create', type: 'box', e})
        hoverBetweenBoxes.remove(e)
	} else if(id === 'labelBtn') 
		crud.run({method: 'create', type: 'label', e})

    if(id === 'darkmode') toggleDarkmode()
})
document.addEventListener("dblclick", e => {
	const id = targetId(e)
    if(id === 'formatedContent' && !queryTarget('.dropdown')) return editor = new Editor(e)
    if(['box', 'frameNav'].includes(id)) toggleTextarea(e, true)
    if(['taskLarge'].includes(parentId(e))) toggleTextarea(e, true)
})
document.addEventListener( 'mousedown', e => {
    const id = targetId(e)
    if(queryTarget('.active-editor')) {
        if(id === 'write' && editor.shouldWriteButtonEnable) editor.write()
        else if(id === 'preview') editor.preview()
        else if(id === 'save') return editor.deactivate(true)
        else if(id === 'cancel') return editor.deactivate()
        
        const input = queryTarget('.active-editor').children.editor
        if(id === 'bold') tools.wrapSelectedText(input, '*')
        else if(id === 'italic') tools.wrapSelectedText(input, '|')
        else if(id === 'underline') tools.wrapSelectedText(input, '_')
        else if(id === 'strikethrough') tools.wrapSelectedText(input, '~')
    }
})
document.addEventListener( 'keydown', e => {
    const key = e.keyCode
    const id = targetId(e)
    if([9, 13, 27].includes(key)) {
        if(id === 'textarea') {
            e.preventDefault()
            if(key === 13) toggleTextarea(e, false, true) //key 13 enter
            else if(key === 27) toggleTextarea(e, false) //key 27 esc
        } else if(id === 'editor' && [9, 27].includes(key)) {
            e.preventDefault()
            if(key === 9) Format.addTabAtCursor(e.target) // key 9 tab
            if(key === 27) editor.deactivate()
        } if(id === 'labelInput') {
			if(key === 13) crud.run({method: 'create', type: 'label', e})
		}
	}
	
    if(parentId(e) === 'frameNav' || id === 'labelInput') 
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
window.addEventListener( 'resize', e => {
    if(contextMenu) contextMenu.toggleMenu(false)
    if(dropdown) dropdown.deactivate()
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










function toggleDarkmode() {
    const targets = [queryTarget('body'), queryTarget('#frame'), queryTarget('.darkModeToggle')]
    targets.forEach(target => {
       target.classList.toggle('light')
    })
}

function hide() {
    ;[queryTarget('#signUp'), queryTarget('#login')].forEach(target => {
        target.style.display = 'none'
    })
}
function show() {
    ;[queryTarget('#signUp'), queryTarget('#login')].forEach(target => {
        target.style.display = 'block'
    })
}
async function toggleTextarea(e, state, save) {
    if(state) {
        dragAndDrop.stopDndOfActiveTextarea = true
        const parent = contextMenu ? contextMenu.extractTarget()
            : queryTarget(`[data-id="${e}"]`) ? queryTarget(`[data-id="${e}"]`)
            : ['taskLarge', 'label'].includes(parentId(e)) ? e.target.parentElement
            : e.target
        const textarea = parent.children.textarea
        toggle(textarea, state)
        frame.previousText = textarea.value
        frame.previousType = parent.id
    } else {
        const textarea = queryTarget('textarea.active')
        try {
            if(save) {
                const parent = textarea.parentElement
                const type = parent.id
                await crud.run({method: 'update', type})
                textarea.innerHTML = textarea.value
                if(type === 'taskLarge') {
                    const task = queryTarget(`.task[data-id="${textarea.parentElement.attributes['data-id'].value}"]`)
                    task.children.textarea.innerHTML = textarea.value
                    task.children.textarea.value = textarea.value
                }
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
            tools.focusAndPutCursorAtEnd(textarea)
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
    const inputSuccess = id => console.log('success', id)
    const inputError = (message, id) => console.log(message, id)
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
		for(let info of content) {
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
    this.run = async ({method, type, e, data}) => { //method = crud; type=component; e = event; data = any additional data.
        try {
            if(!frame.data) throw'No frame data'
            let input = this.getData(method, type, e, data)
            if(!input) throw 'No input where gathered'
            console.log(input)

            if(method !== 'read') {
                const response = await server.postFetch(method, {type, ...input, token: cookie.get('token')})
                if(validate.status(response.status) || !response.status) throw 'Request denied'
				console.log(response)
                if(method === 'create') {
                    if(!response.id) throw 'No server response to creation request'
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

    this.getData = function(method, type, e, data) {

        /* PROCESS START */
        let target

        contextMenu ? ifContextMenu()
            : method === 'read' ? ifRead()
            : method === 'update' ? ifUpdate()
            : method === 'create' ? ifCreate()
            : ''
        
		data = target ? {...getIds(), ...data} : data
		
		if(!data) data = ''
		else if(data.data)
			if(data.data.text)
				data = data.type === 'label' && data.data.text ? ''
					: data.type === 'description' ? data.data.description && data.data.description === editor.previousText
					: data.data.text && data.data.text === frame.previousText ? ''
					: data
		return data
        /* PROCESS END */

        /* DELIGATION FUNCTIONS */
        function getIds() {
            let ids = {id: target.attributes['data-id']}
            if(['task', 'label', 'box'].includes(type)) ids = {...ids, parentId: target.parentElement.attributes['data-id']}
            if(['task', 'label'].includes(type)) ids = {...ids, grandParentId: target.parentElement.parentElement.attributes['data-id']}
            return tools.ifAttributesGetValues(ids)
        }
        
        /* Case dependent preperation */
        function ifContextMenu() {
            target = contextMenu.extractTarget(e)
            if(type === 'task') data = {renderType: 'taskLarge'}
        }
        function ifCreate() {
			if(type === 'label') {
				const taskId = queryTarget('.taskLarge').attributes['data-id'].value
				target = queryTarget(`.task[data-id="${taskId}"`)
				data = {...data, text: queryTarget('#labelInput').value}
			}
            if(type === 'task') {
                target = e.target.parentElement
                type = 'box'
                data = {data: {...data, color: 'default'}}
            } else if(type === 'box') {
                data =  tools.ifAttributesGetValues({idToRenderAt: e.target.parentElement.attributes['data-id']})
                target = e.target.parentElement.parentElement
                type = 'frame'
            }
        }
        function ifRead() {
            target = e.target
            data = {renderType: type === 'task' ? 'taskLarge' : type}
        }
        function ifUpdate() {
            const textarea = queryTarget('#textarea.active')
            const taskLarge = queryTarget('.taskLarge')

            if(textarea) {
                target = textarea.parentElement
                if(type === 'taskLarge') target = queryTarget(`.task[data-id="${target.attributes['data-id'].value}"]`)
            } else if(taskLarge) {
                target = queryTarget(`.task[data-id="${taskLarge.attributes['data-id'].value}"]`) 
            }

            const id = target ? target.id : type
            type = id === 'frameNav' ? 'frame' : id === 'taskLarge' ? 'task': id //Converts render types into basic types
            data = textarea ? {...data, text: textarea.value} 
                : data.color ? {...data, color: data.color.split('-').pop()}
                : data
            data = {data, type}
        }
    }
    
    this.DOMHandler = function(method, type, input) {
        const {id, data} = input

        method === 'create' ? ifCreate()
            : method === 'read' ? ifRead()
            : method === 'update' ? ifUpdate()
            : method === 'delete' ? ifDelete()
            : ''

        return Promise.resolve()

         /* Case dependent rendering */
        function ifCreate() {
            if(type === 'frame') {
                if(response.frame) frame = new Frame(response.frame) //! fake
            } else if(type === 'task') render[type](input)
            else if(['box', 'subtask', 'label'].includes(type)) render[type](input)
        }
        function ifRead() {
            if(type === 'frame') {
                if(response.frame) frame = new Frame(response.frame) //! fake
            } else if(type === 'task') render[`${input.renderType}`](input)
            else if(['box', 'subtask'].includes(type)) if(response[type]) render[type](input)
        }
        function ifUpdate() {
            let {color} = data
            if(color) {
                const taskContainer = queryTarget('.taskLarge-container')
                const taskId = taskContainer.children.taskLarge.attributes['data-id'].value
                const task = queryTarget(`.task[data-id="${taskId}"]`)

                tools.removeAllClassNamesContainingStringOfTarget([task, taskContainer], 'color-')
                taskContainer.classList.add(`color-${color}`)
                task.classList.add(`color-${color}`)
                queryTarget('#colorBtn').children.colorBtn_text.innerHTML = tools.capitalizeFirstLetter(color)
            }
        }
        function ifDelete() {
            if(type === 'frame') frame = new Frame()  //! fake?
            else if(['box', 'task', 'subtask'].includes(type)) render.eject(`.${type}[data-id="${id}"]`)
        }
    }

    function updateStoredValues(method, type, {createdId, id, parentId, data}) {
        if(method === 'create') {
            console.log(data)
			if(type === 'task') frame.addTask({id: createdId, parentId: id, data})
			if(type === 'label') frame.addLabel({id: createdId, parentId: id, grandParentId: parentId, data})
        }
        if(method === 'update') {
            if(type === 'box') frame.updateBox({id, data})
            if(type === 'task') frame.updateTask({id: id, parentId: parentId, data: data})
        }
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

        tools.throttle(function() {
            const data = frame.screenshot()
            crud.run({method: 'update', type: 'pos', data})
        }, 1000)
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
function Dropdown(e, type, id) {
	const button = e.target
	let dropdownContainer
	let stopDeactivation = false

	this.deactivate = () => {
		if(stopDeactivation) return stopDeactivation = false
		dropdownContainer.removeEventListener('click', onClickInsideDropdown)
		render.eject('.dropdown')
		dropdown = ''
	}

	init()
	async function init() {
		dropdownContainer = await render.dropdown(button, type, id)
		if(type !== 'colorBtn') {
			dropdownContainer.addEventListener('click', onClickInsideDropdown)
		}
	}
	function onClickInsideDropdown() {
		stopDeactivation = true
	}
}
function Editor(e) {
	if(!e) return
	const formatedArea = e.target
	const textarea = formatedArea.previousElementSibling
	const container = formatedArea.parentElement
	this.previousText = textarea.value
	let beforePreview
	this.shouldWriteButtonEnable = false

	this.deactivate = async save => {
		if(save) {
			try {
				const text = textarea.value
				await crud.run({method: 'update', type: 'description', data: {description: Sanitize.withHTMLCode(text)}})
				this.format(text)
			} catch (error) {
				console.log(error)
			}
		} else {
			textarea.value = this.previousText
			this.format(this.previousText)
		}
		container.classList.remove('active-editor')
		container.removeEventListener('click', containerOnClick)
		tools.setAreaHeight(textarea)
		formatedArea.classList.remove('editor')
	}

	this.format = text => {
		const {formated} = tools.cleanAndFormat(text)
		formatedArea.innerHTML = formated
	}

	this.preview = () => {
		this.shouldWriteButtonEnable = true
		beforePreview = textarea.value
		this.format(beforePreview)
		textarea.classList.add('hide')
		formatedArea.classList.add('editor')
	}
	this.write = () => {
		textarea.value = beforePreview
		formatedArea.innerHTML = this.previousText
		textarea.classList.remove('hide')
		formatedArea.classList.remove('editor')
	}

	const containerOnClick = e => {
		e.stopPropagation() //stop deactivation of editor while inside container
	}
	
	textarea.classList.remove('hide')
	container.addEventListener('click', containerOnClick)
	container.classList.add('active-editor')
	tools.resizeAreaToFitContent(textarea)
	tools.focusAndPutCursorAtEnd(textarea)
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
class Format {
	static replaceAllRequestedSymbolsWithSpanTags = input => {
		const symbolsDatas = [
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
		const combinationsDatas = [
			{
				combo: '* ',
				replacement: '\&#8226 ',
			},
		]
        
		let output = '', classes = '', isSymbol, index = 0
		const charArr = input.split('')
		
		while(index < charArr.length) {
			isSymbol = false
			symbolsDatas.forEach(symbolData => {
				if(charArr[index] === symbolData.symbol) {
					isSymbol = true
					if(symbolData.isAlive) {
						if(charArr[index-1] === ' ') addToOutput(charArr[index])
						else {
							addToOutput(tags(false))
							removeClass(symbolData.class)
							symbolData.isAlive = false
						}
					} else {
						if(charArr[index+1] === ' ') addToOutput(charArr[index])
						else {
							if(!hasAClose(index, symbolData.symbol)) return addToOutput(charArr[index])
							addClass(symbolData.class)
							addToOutput(tags(true, symbolData.class))
							symbolData.isAlive = true
						}
					}
				}
			})
			if(!isSymbol) addToOutput(charArr[index])
			index++
		}

		index = 0
		combinationsDatas.forEach(combinationData => {
			while ((index = output.indexOf(combinationData.combo, index)) > -1) {
				output = output.replace(combinationData.combo, combinationData.replacement)
				index += combinationData.combo.length
			}
				
		})

		return output


		function addToOutput(text) { output += text }
		function tags(opening, className) {
			return opening ? 
				classes.indicesOf(' ').length === 1 ? `<span class="${className}">` : `</span><span class="${classes}">`
				: `</span>`
		}
		function addClass(className){
			classes += `${className} `
		}
		function removeClass(className) {
			classes = classes.replace(`${className} `, '')
		}
		function hasAClose(index, symbol) {
			while(index < charArr.length) {
				if(charArr[index] === symbol)
					if(charArr[index-1] !== ' ') 
						return true
				index++
			}
		}
	}

	static addTabAtCursor(target) {
		const tab = '\t'
		const {startIndex, endIndex} = tools.getSelectedText(target)
		target.value = target.value.replaceBetween(tab, startIndex, endIndex)
		tools.putCursorAtIndex(target, startIndex+1)
	}
}
function Frame({_id, text, description, author, members, boxes}) {
	this.previousText
	this.previousType
	if(!_id) return queryTarget('#render').innerHTML = ''
	
	
	this.addLabel = ({id, parentId, grandParentId, data}) => (
		this.boxes.find(box => (
			grandParentId == box.id
		)).tasks.find(task=> (
			parentId = task.id
		)).labels.push( {id, ...data} )
	)
	this.addTask = ({id, parentId, data}) => (
		this.boxes.find(box => (
			parentId == box.id
		)).tasks.push( {id, ...data} )
	)

	this.updateTask = ({data, id, parentId}) => { 
		for(const key in data) 
			Object.assign(
				this.boxes.find(box => (
					parentId == box.id
				)).tasks.find(task => (
					id == task.id
				))
				, {[key]: data[key]}
			)
	}

	this.updateBox = ({id, data}) => {
		for(const key in data)
			Object.assign(this.boxes.find(box => id == box.id), {[key]: data[key]})
	}

	this.data = {
		id: _id,
		text,
		description,
		author,
		members: members.map(member => ({
			id: member.id,
			text: member.text,
			profileImgLink: member.profileImgLink,
		})),
	}
	this.boxes = boxes.map(({id, text, color, posId, tasks}) => ({
		id,
		text,
		color,
		posId,
		tasks: tasks.map(({id, text, description, color, posId, date, labels, members, subtasks}) => ({
			id,
			text,
			description,
			color,
			posId,
			date,
			labels,
			members: members.map(member => member.id),
			subtasks: subtasks.map(({id, text, posId, member}) => ({
				id,
				text,
				posId,
				member,
			})),
		})),
	}))
	
	this.init = async () => {
		try {
			await render.frame(this.data, this.boxes)
			dragAndDrop = new DragAndDrop()
		} catch (error) {
			console.log(error)
		}
	}
	this.init()

	this.screenshot = () => {
		let {attributes, children} = queryTarget('#frame')
		return {
			id: attributes['data-id'].value,
			boxes: [...children].map(({attributes}) => ({
				id: attributes['data-id'].value,
				posId: attributes['data-pos'].value,
				tasks: [...queryTargetAll(`[data-id="${attributes['data-id'].value}"] .task`)].map(({attributes, children}) => ({
					id: attributes['data-id'].value,
					posId: attributes['data-pos'].value,
					subtasks: children.hiddenSubtask ? [...children.hiddenSubtask.children].map(({attributes})=>({
						id: attributes['data-id'].value,
						posId: attributes['data-pos'].value,
					})) : [],
				}))
			}))
		}
	}
}
function Render() {
	this.frame = async (data, boxes) => {
		await renderFrame()
		;[...queryTargetAll('#textarea')].forEach(textarea => {
			tools.resizeAreaToFitContent(textarea)
		})
		return Promise.resolve()

		function renderFrame() {
			queryTarget('#render').innerHTML = themplates.frame(data, boxes)
			return Promise.resolve()
		}
	}
	
	this.box = async data => {
		await renderBox()
		toggleTextarea(5, true)
		return Promise.resolve()
		
		function renderBox() {
			const parent = queryTarget(`.box[data-id="${data.idToRenderAt}"`)
			parent.insertAdjacentHTML('afterend', themplates.box({id: 5, title: ' '}))
			return Promise.resolve()
		}
	}
	
	this.taskLarge = async data => {
		const boxes = frame.boxes
		const box = boxes.find(box => box.id == data.parentId)

		const task = {...box.tasks.find(task => task.id == data.id), parent: box.text}
		await renderTaskLarge()
		tools.resizeAreaToFitContent(queryTarget(`.taskLarge[data-id="${task.id}"`).children.textarea)
		if(task.description) {
			const {formated} = tools.cleanAndFormat(task.description, true)
			queryTarget('.editor-container').children.formatedContent.innerHTML = formated
		}
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
			const parent = queryTarget(`.box[data-id="${data.id}"]`)
			parent.insertAdjacentHTML('beforeend', themplates.task({id: data.createdId, text: ' '}))
			return Promise.resolve()
		}
	}
	this.label = async data => {
		await renderLabel()
		queryTarget('#labelInput').value = ''

		function renderLabel() {
			const targetTaskLarge = queryTarget('#labels').lastElementChild
			const label = themplates.label({id: data.createdId, text: data.text})
			targetTaskLarge.insertAdjacentHTML('beforebegin', label)
			return Promise.resolve()
		}
	}
	this.contextMenu = (id, type) => {
		queryTarget('main').insertAdjacentHTML('beforeend', themplates.contextMenu(id, type))
	}
	this.dropdown = async (target, type, id) => {
		await renderDropdown()
		const dropdownHTML = queryTarget('.dropdown')
		const {posX, posY} = tools.getPostionUnderEventContainer(target)
		tools.positionAbsoluteBoxAt(dropdownHTML, posX, posY)
		return Promise.resolve(dropdownHTML)

		function renderDropdown() {
			queryTarget('.taskLarge-container').insertAdjacentHTML('beforeend', themplates.dropdown(type, id))
			return Promise.resolve()
		}
	}
	this.eject = param => queryTarget(param).remove()
 }
class Sanitize {
    static withHTMLCode(string, reverse) {
		let map = {
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			"`": '&#96;',
		}

		reverse ? Object.entries(map).forEach(([key, value]) => string = string.replace(value, key))
		: string = string.replace(/[<>"'`]/ig, (match)=>(map[match]))
		
		return string
	}
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
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': true 
		},
		mode : 'cors',
		body: JSON.stringify(data),
	})
	const getUrl = dest => `${fetchUrl}/ToDo${action[dest]}` //https://98.128.142.46/
}
function Themplates() {
	this.frame = ({id, text}, boxes) => `
		<nav class="frameNav" id="frameNav" data-id="${id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="2">${text}</textarea>
		</nav>
		<div class="frame" id="frame" data-id="${id}">${boxes ? boxes.map(box => this.box(box)).join('') : ''}</div>
	`
	this.box = ({id, tasks, text, posId}) => `
		<ul class="box" id="box" draggable="true" data-id="${id}" data-pos="${posId}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
			<button id="create" data-type="task">+</button>
			${tasks ? tasks.map(task => this.task(task)).join('') : ''}
			<span id="boxAdd" data-partnerId="${id}" />
		</ul>
	`
	this.task = ({id, text, color, posId, subtasks}) => `
		<li class="task ${color !== 'default' ? `color-${color}` : ''}" id="task" draggable="true"  data-id="${id}" data-pos="${posId}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
			${subtasks && subtasks.length ? `<div style="display: none" id="hiddenSubtask">${subtasks.map(subtask=>this.subtask(subtask))}</div>` : ''}
		</li>
	`
	this.taskLarge = ({color, parent, id, text, description, subtasks, labels, members}) => `
		<div class="taskLarge-container ${color !== 'default' ? `color-${color}` : ''}" id="taskLarge-container">
			<div class="taskLarge" id="taskLarge"  data-id="${id}">
				<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" draggable="false">${text ? text : ''}</textarea>
				<p>In <b>${parent}</b></p>
				<div class="info" data-id="${id}">
					<div class="color">
						<label>Color</label>
						<button id="colorBtn"><span class="circle"></span><span id="colorBtn_text">${color ? tools.capitalizeFirstLetter(color) : color}</span></button>
					</div>
					<div class="members">
						<label>Members</label>
						<div>
							<div>
								<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
								<span>
							</div>
							<div>
								<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
								<span>
							</div>
							<button id="membersBtn" />
						</div>
					</div>
					<div class="labels">
						<label>Labels</label>
						<div id="labels">
							${labels ? labels.map(label=>this.label(label)) : ''}
							<button id="labelsBtn" />
						</div>
					</div>
				</div>
				${description ? this.editor(description) : ''}
				${subtasks && subtasks.length ? this.subtaskContainer(subtasks) : ''}
			</div>
		</div>
	`

	this.subtaskContainer = subtasks => `
		<div class="subtask-container">
			<div id="subtaskInfo">
				<p>Subtasks</p>
				<p id="numberOfSubtasks">${subtasks.length}</p>
				<button><span></span></button>
			</div>
			<div id="subtasks">
				${subtasks.map(subtask => this.subtask(subtask)).join('')}
				<div id="addSubtask">
					<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" placeholder="Add subtask..."></textarea>
					<button />
				</div>
			</div>
		</div>
	`

	this.subtask = ({id, text, posId}) => `
		<div class="subtask" data-id="${id}" data-pos="${posId}">
			<input type="checkbox">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
			<button><span></span></button>
		</div>
	`
	
	this.editor = description => `
		<div class="editor-container" id="editor-container">
			<div class="toolbar">
				<div>
					<button id="write">Write</button>
					<button id="preview">Preview</button>
				</div>
				<div>
					<span id="bold"></span>
					<span id="italic"></span>
					<span id="underline"></span>
					<span id="strikethrough"></span>
				</div>
			</div>
			<textarea class="editor" id="editor" spellcheck="false" data-enablewrite="true">${description}</textarea>
			<p id="formatedContent"></p>
			<div class="optionbar">
				<button id="save">Save</button><button id="cancel">Cancel</button>
			</div>
		</div>
	`
	this.label = ({text, id}) => `
		<div data-id="${id}"><p>${text}</p><span></div>
	`


	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">${console.log(type)}
			<ul data-id="${id}" data-type="${type}">
				${!['frame', 'frameNav', 'label'].includes(type) ? '<li id="read">View</li>' : ''}
				${type === 'box' ? '<li id="create">Add</li>' : ''}
				<li id="update">Edit</li>
				${!['frame', 'frameNav'].includes(type) ? '<li id="delete">Delete</li>' : ''}
			</ul>
		</nav>
	`

	this.dropdown = (type, id) => `
		<div class="dropdown" id="dropdown" data-id="${id}" data-type="${type}">
			${type === 'colorBtn' ? `
				<ul class="colorList" id="colorList">
					<li id="color-yellow">Yellow</li>
					<li id="color-green">Green</li>
					<li id="color-red">Red</li>
					<li id="color-blue">Blue</li>
					<li id="color-crimson">Crimson</li>
					<li id="color-indigo">Indigo</li>
					<li id="color-defualt">Default</li>
				</ul>`
			: ''}
			<div>
				${type === 'labelsBtn' ? `
					<div id="input-container">
						<input id="labelInput" placeholder="add label...">
						<button id="labelBtn" />
					</div>
					`
				: ''}
				${type === 'membersBtn' ? `
					<div id="membersList">
						${
							frame.boxes.find(box => (
								box.id === queryTarget(`.task[data-id="${id}"]`).parentElement.attributes['data-id'].value
							)).tasks.find(task => (
								task.id === id 
							)).members.map(({id, text, url}) => `
								<div class="img" data-id="${id}" data-name="${text}">
									<div class="img"><img src="${url}"></div>
									<span>${text}</span>
								</div>
							`)
						}
						<div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"></div>
							<span>
						</div>
					</div>
					<div id="input-container">
						<input id="membersInput" placeholder="Email...">
						<button id="inviteMembersBtn" />
					</div>
					`
				: ''}
			</div>
		</div> 
	`

	
}
function Tools() {
	let throttle
	this.getScreenHeight = () => window.scrollY
	this.keepPositionY = func => {
		y = this.getScreenHeight()
		func()
		this.scrollToInstantly({top: y})
	}
	this.scrollToInstantly = param => window.scrollTo(param)
	this.throttle = (func, ms) => {
		this.cancelThrottle()
		throttle = setTimeout(() => func(), ms)
	}
	this.cancelThrottle = () => throttle ? clearTimeout(throttle) : ''
	
	this.getSelectedText = element => window.getSelection ? {
		selectedText: element.value.substring(element.selectionStart, element.selectionEnd), 
		startIndex: element.selectionStart, 
		endIndex: element.selectionEnd
	} : ''

	this.wrapSelectedText = (input, symbol) => {
		if(!input.dataset.enablewrite) return
		const {selectedText, startIndex, endIndex} = this.getSelectedText(input)
		input.value = input.value.replaceBetween(`${symbol}${selectedText}${symbol}`, startIndex, endIndex)
	}

	this.cleanAndFormat = text => {
		text = Sanitize.withHTMLCode(text)
		const formated = Format.replaceAllRequestedSymbolsWithSpanTags(text)
		return {cleaned: text, formated: formated}
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

		return {posX, posY}
	}
	
	this.getPostionUnderEventContainer = (target) => ({
		posX : target.offsetLeft, 
		posY: 2 + target.offsetTop + target.offsetHeight,
	})

	this.positionAbsoluteBoxAt = (target, x, y) => {
        const targetWidth = target.offsetWidth + 4
        const targetHeight = target.offsetHeight + 4
        const documentWidth = document.innerWidth
        const documentHeight = document.innerHeight

        target.style.left = ((documentWidth - x) < targetWidth) ? `${documentWidth - targetWidth}px` : `${x}px`
        target.style.top = ((documentHeight - y) < targetHeight) ? `${documentHeight - targetHeight}px` : `${y}px`
	}
	
	this.ifAttributesGetValues = (ids) => {
		let arr
		for(const id in ids)
			arr = ids[id] ? {...arr, [id]: ids[id].value} : ''
		return arr.length === ids.length ? arr : ''
	}

	this.focusAndPutCursorAtEnd = target => {
		if(document.activeElement !== target) target.focus()
		let len = target.value.length * 2
		
		setTimeout(function() {
			target.setSelectionRange(len, len)
		}, 1)
		target.scrollTop = 999999
	}

	this.putCursorAtIndex = (target, index) => {
		target.setSelectionRange(index, index)
	}

	this.removeAllClassNamesContainingStringOfTarget = (el, string) => {
		Array.isArray(el) ? el.forEach(target => action(target)) : action(el)
		function action(target) {
			[...target.classList].forEach(className => className.search(string) === 0 ? target.classList.remove(className) : '')
		}
	}

	this.capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1, string.length).toLowerCase()
}

function User(datas) {
	let data
	let frames
	this.getUser = () => data
	this.getFrames = () => frames
	this.logOut = () => {
		cookie.destroy('token')
		user = new User('')
		frame = new Frame({})
		show()
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
				id: frame._id,
				title: frame.text,
			}))
		} else {
			try {
				if(cookie.check('token')) datas = await server.postFetch('user', {token: cookie.get('token')})
				console.log(datas)

				if(validate.status(datas.status)) throw 'Login with token failed'
				user = new User(datas)
			} catch (error) {
				console.log(error)
				const loadingscreen = queryTarget('.loadingscreen')
				if(loadingscreen) loadingscreen.remove()
			}
		}
	}
}
function Validate() {
    let password
    this.hasScrollbar = target => target.scrollHeight > target.clientHeight

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
        const errorMessages = form.errorMessages[grandParentId(e)]
        
        if(isInputValid(input, id)) 
            errorMessages[id] = ''
        announce.formFeedback({[id]: errorMessages[id]})
    }

	function isInputValid(input, id) {
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
        return !(status <= 200 && status >= 0) // flase = successfull true = failed
    } 
}