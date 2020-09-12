function Themplates() {
	this.frame = frame => `
		<nav><h1>${frame.data.title}</h1></nav>
		<div class="frame" data-id="${frame.data.id}">${frame.boxes.map(box => this.box(box)).join('')}</div>
	`
	this.box = box => `
		<ul class="box" id="box" draggable="true" data-id="${box.id}">
			<h2>${box.title}</h2>
			<button id="create">+</button>
			${box.tasks.map(task => this.taskMin(task)).join('')}
		</ul>
	`
	this.taskMin = task => `
		<li class="task" id="task" draggable="true"  data-id="${task.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${task.text}</textarea>
		</li>
	`
	this.subtask = () => `
	
	`
	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">
			<ul data-id="${id}" data-type="${type}">
				<li id="veiw">View</li>
				${type === 'box' ? '<li id="create">Add</li>' : ''}
				<li id="update">Edit</li>
				<li id="delete">Delete</li>
			</ul>
		</nav>
	`
}