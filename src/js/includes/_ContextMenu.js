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