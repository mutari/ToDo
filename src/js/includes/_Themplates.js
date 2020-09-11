function Themplates() {
	this.frame = frame => `
		<h1>${frame.data.title}</h1>
		<div class="frame" data-id="${frame.data.id}">${frame.boxes.map(box => this.box(box)).join('')}</div>
	`
	this.box = box => `
		<ul class="box" id="box" draggable="true" data-id="${box.id}">
			<h2>${box.title}</h2>
			${box.tasks.map(task => this.taskMin(task)).join('')}
		</ul>
	`
	this.taskMin = task => `
		<li class="task" id="task" draggable="true" data-id="${task.id}"><p>${task.text}</p></li>
	`
	this.subtask = () => `
	
	`
	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">
			<ul data-id="${id}" data-type="${type}">
				<li id="read">View</li>
				<li id="edit">Edit</li>
				<li id="delete">Delete</li>
			</ul>
		</nav>
	`
}