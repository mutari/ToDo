function ContextMenu() {
    let isMenuActive = false
    const menu = queryTarget('#context-menu')

    document.addEventListener( 'contextmenu', e => {
        if (targetId(e) === 'task') {
            e.preventDefault()
            this.toggleMenu(true)
            this.positionMenu(e)
        } else this.toggleMenu(false)
    })

    this.toggleMenu = state => {
        if(isMenuActive && !state) {
            isMenuActive = false
            menu.classList.remove('active')
        } else if(!isMenuActive && state) {
            isMenuActive = true
            menu.classList.add('active')
        }
    }

    this.positionMenu = (e) => {
        const {posX, posY} = tools.getPositionOfEvent(e)
        tools.positionAbsoluteBoxAt(menu, posX, posY)
    }
}