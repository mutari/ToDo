function Themplates() {
	this.frame = frame => `
		<nav class="frameNav" id="frameNav" data-id="${frame.data.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="2">${frame.data.text}</textarea>
		</nav>
		<div class="frame" id="frame" data-id="${frame.data.id}">${frame.boxes ? frame.boxes.map(box => this.box(box)).join('') : ''}</div>
	`
	this.box = box => `
		<ul class="box" id="box" draggable="true" data-id="${box.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${box.text}</textarea>
			<button id="create" data-type="task">+</button>
			${box.tasks ? box.tasks.map(task => this.task(task)).join('') : ''}
			<span id="boxAdd" data-partnerId="${box.id}" />
		</ul>
	`
	this.task = task => `
		<li class="task" id="task" draggable="true"  data-id="${task.id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${task.text}</textarea>
		</li>
	`
	this.taskLarge = task => `
		<div class="task-container">
			<div class="taskLarge" id="taskLarge"  data-id="${task.id}">
				<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${task.text ? task.text : ''}</textarea>
				<p>In <b>${task.parent}</b></p>
				<div></div>
				${task.description ? this.editor(task.description) : ''}
			</div>
			<span id="taskShadow"></span>
		</div>
	`
	this.subtask = () => `
	
	`
	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">
			<ul data-id="${id}" data-type="${type}">
				${!['frame', 'frameNav'].includes(type) ? '<li id="read">View</li>' : ''}
				${type === 'box' ? '<li id="create">Add</li>' : ''}
				<li id="update">Edit</li>
				${!['frame', 'frameNav'].includes(type) ? '<li id="delete">Delete</li>' : ''}
			</ul>
		</nav>
	`

	this.editor = description => `
		<div class="editor-container" id="editor-container">
			<div class="toolbar">
				<div>
					<button id="write">Write</button>
					<button id="preview">Preview</button>
				</div>
				<div>
					<a class="fa fa-bold fa-fw" id="bold" unselectable="on"></a>
					<a class="fa fa-italic fa-fw" id="italic"></a>
					<a class="fa fa-underline fa-fw" id="underline"></a>
					<a class="fa fa-list fa-fw" id="list"></a>
					<a class="fa fa-link fa-fw" id="link"></a>
				</div>
			</div>
			<textarea class="editor" id="editor" spellcheck="false" data-enablewrite="true">${description}</textarea>
			<p id="formatedContent"></p>
			<div class="optionbar">
				<button id="save">Save</button><button id="cancel">Cancel</button>
			</div>
		</div>
	`
}