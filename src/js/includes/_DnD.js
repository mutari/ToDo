function DragAndDrop() {
    let dragSrcEl = null
    let dragType = false
    let cancelLeave
    
    this.frame = queryTarget('.frame')
    this.tasks = () => [...queryTargetAll('.box .task')]
    this.boxes = () => [...queryTargetAll('.frame .box')]
    
    this.handleDragStart = e => {
        if(queryTarget('textarea.active')) frame.toggleTextarea(e, false)
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