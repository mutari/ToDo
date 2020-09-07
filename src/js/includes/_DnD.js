function DragAndDrop() {
    let dragSrcEl = null
    let dragType = false
    let cancelLeave
    
    this.tasks = () => [...queryTargetAll('.box .task')]
    this.boxes = () => [...queryTargetAll('.frame .box')]
    
    this.handleDragStart = e => {
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
        }
    }
    
    this.handleDragEnd = e => {
        e.target.style.opacity = 1
        this.tasks().removeClass('over')
        this.boxes().removeClass('over')
    }
    
    const addDndEventListener = item => {
        item.addEventListener('dragstart', this.handleDragStart, false)
        item.addEventListener('dragenter', this.handleDragEnter, false)
        item.addEventListener('dragover', this.handleDragOver, false)
        item.addEventListener('dragleave', this.handleDragLeave, false)
        item.addEventListener('drop', this.handleDrop, false)
        item.addEventListener('dragend', this.handleDragEnd, false)
    }
    
    this.tasks().forEach(task => addDndEventListener(task))
    this.boxes().forEach(box => addDndEventListener(box))
    
}