function DragAndDrop() {
    let dragSrcEl = null
    this.items = [...document.querySelectorAll('.container-dnd .task-dnd')]
    
    this.handleDragStart = e => {
      e.target.style.opacity = '0.4'
      
      dragSrcEl = e.target
  
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/html', e.target.innerHTML)
    }
  
    this.handleDragOver = e => {
      if (e.preventDefault) {
        e.preventDefault()
      }
  
      e.dataTransfer.dropEffect = 'move'
      
      return false
    }
  
    this.handleDragEnter = e => {
      e.target.classList.add('over')
    }
  
    this.handleDragLeave = e => {
      e.target.classList.remove('over')
    }
  
    this.handleDrop = e => {
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      
      if (dragSrcEl != e.target) {
        dragSrcEl.innerHTML = e.target.innerHTML
        e.target.innerHTML = e.dataTransfer.getData('text/html')
      }
      
      return false
    }
  
    this.handleDragEnd = e => {
      e.target.style.opacity = '1'
      
      this.items.forEach(item => {
        item.classList.remove('over')
      })
    }
    
    
    
    const addDndEventListener = item => {
      item.addEventListener('dragstart', this.handleDragStart, false)
      item.addEventListener('dragenter', this.handleDragEnter, false)
      item.addEventListener('dragover', this.handleDragOver, false)
      item.addEventListener('dragleave', this.handleDragLeave, false)
      item.addEventListener('drop', this.handleDrop, false)
      item.addEventListener('dragend', this.handleDragEnd, false)
    }
    
    this.items.forEach(item => addDndEventListener(item))
   
}