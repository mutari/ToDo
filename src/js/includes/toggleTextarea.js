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
                await crud.run('update', type)
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