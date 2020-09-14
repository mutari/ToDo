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