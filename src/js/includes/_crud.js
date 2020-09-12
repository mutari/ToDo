async function crud(method, type, e) {
    try {
        if(!frame.getData()) return
        let input = getData(method, type, e)
        if(!input) throw ''

        const response = await server.postFetch(method, {type, ...input, token: cookie.get('token')})
        if(validate.status(response.status) || !response.status) throw ''

        if(method === 'create') {
            if(!response.id) throw ''
            input = {...input, createdId: response.id}
        }
        return DOMHandler(method, type, input)
    } catch (err) {
        console.log(err)
        return Promise.reject()
    }

    function getData(method, type, e) {
        let data, textarea, target

        if(method === 'update') {
            textarea = queryTarget('#textarea.active')
            target = textarea.parentElement
            type = target.id
            data = {data: {text: textarea.value}, type}
        } else if(method === 'create') {
            target = e.target.parentElement
            type = 'box'
        } else {
            target = contextMenu.extractTarget(e)
        }

        switch (type) {
            case 'task':
                data = {
                    ...tools.ifAttributesGetValues({
                        id: target.attributes['data-id'],
                        boxId: target.parentElement.attributes['data-id'],
                        frameId: target.parentElement.parentElement.attributes['data-id'],
                    }), ...ids }
                break
            case 'box':
                data = tools.ifAttributesGetValues({
                    id: target.attributes['data-id'],
                    frameId: target.parentElement.attributes['data-id'],
                })
                break
            case 'frame':
                data =  tools.ifAttributesGetValues(target.attributes['data-id'])
                break
        }
        return (!data || (data.data && data.data.text === frame.previousText)) ? '' : data //return '' if no change on update
    }
    
    function DOMHandler(method, type, input) {
        switch (method) {
            case 'create':
                if(type === 'frame') {
                    if(response.frame) frame = new Frame(response.frame) //! fake
                } else if(['box', 'task', 'subtask'].includes(type)) render[type](input)
                break
            case 'read': //! fake
                if(type === 'frame') if(response.frame) frame = new Frame(response.frame)
                else if(['box', 'task', 'subtask'].includes(type)) if(response[type]) render[type](input)
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
}