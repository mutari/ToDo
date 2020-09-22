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
        let textarea, target

        contextMenu ? ifContextMenu()
            : method === 'read' ? ifRead()
            : method === 'update' ? ifUpdate()
            : method === 'create' ? ifCreate()
            : ''
        
        data = {...getIds(), ...data}
        console.log(data)

        return (!data ||  (data.data && data.data.text && data.data.text === frame.previousText)) ? '' : data
        /* PROCESS END */

        /* DELIGATION FUNCTIONS */
        function getIds() {
            let ids = {id: target.attributes['data-id']}
            if(['task', 'box'].includes(type)) ids = {...ids, parentId: target.parentElement.attributes['data-id']}
            if(type === 'task') ids = {...ids, grandParentId: target.parentElement.parentElement.attributes['data-id']}
            return tools.ifAttributesGetValues(ids)
        }
        
        /* Case dependent preperation */
        function ifContextMenu() {
            target = contextMenu.extractTarget(e)
            if(type === 'task') data = {renderType: 'taskLarge'}
        }
        function ifCreate() {
            if(type === 'task') {
                target = e.target.parentElement
                type = 'box'
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

            if(textarea) {
                target = textarea.parentElement
                if(type === 'taskLarge') target = queryTarget(`.task[data-id="${target.attributes['data-id'].value}"]`)
            } else {
                target = queryTarget('.taskLarge')
                target = queryTarget(`.task[data-id="${target.attributes['data-id'].value}"]`) 
            }

            const id = target.id
            type = id === 'frameNav' ? 'frame' : id === 'taskLarge' ? 'task': id //Convert DOM specific types into basic types
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

         /* Case dependent preperation */
        function ifCreate() {
            if(type === 'frame') {
                if(response.frame) frame = new Frame(response.frame) //! fake
            } else if(type === 'task') render[type](input)
            else if(['box', 'subtask'].includes(type)) render[type](input)
        }
        function ifRead() {
            if(type === 'frame') {
                if(response.frame) frame = new Frame(response.frame) //! fake
            } else if(type === 'task') render[`${input.renderType}`](input)
            else if(['box', 'subtask'].includes(type)) if(response[type]) render[type](input)
        }
        function ifUpdate() {
            if(data.color) {
                const taskContainer = queryTarget('.taskLarge-container')
                const taskId = taskContainer.children.taskLarge.attributes['data-id'].value
                const task = queryTarget(`.task[data-id="${taskId}"]`)
                tools.removeAllClassNamesContainingStringOfTarget([task, taskContainer], 'color-')
                taskContainer.classList.add(`color-${data.color}`)
                task.classList.add(`color-${data.color}`)
                queryTarget('#colorBtn').children.colorBtn_text.innerHTML = tools.capitalizeFirstLetter(data.color)
            }
        }
        function ifDelete() {
            if(type === 'frame') frame = new Frame()  //! fake?
            else if(['box', 'task', 'subtask'].includes(type)) render.eject(`.${type}[data-id="${id}"]`)
        }
    }

    function updateStoredValues(method, type, {createdId, id, parentId, data}) {
        if(method === 'create') {
            if(type === 'task') frame.addTask({id: createdId, parentId: id})
        }
        if(method === 'update') frame.updateTask({id: id, parentId: parentId, data: data})
    }
}