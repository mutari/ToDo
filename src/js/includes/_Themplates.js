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
		<div class="taskLarge-container" id="taskLarge-container">
			<div class="taskLarge" id="taskLarge"  data-id="${task.id}">
				<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" draggable="false">${task.text ? task.text : ''}</textarea>
				<p>In <b>${task.parent}</b></p>
				<div class="info" data-id="${task.id}">
					<div class="color">
						<label>Color</label>
						<button id="colorBtn"><span class="circle"></span><span>Yellow</span></button>
					</div>
					<div class="members">
						<label>Members</label>
						<div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
							<button id="membersBtn" />
						</div>
					</div>
					<div class="labels">
						<label>Labels</label>
						<div id="labels">
							<div>Project-x</div>
							<div>Design</div>
							<div>Design</div>
							<button id="labelsBtn" />
						</div>
					</div>
				</div>
				${task.description ? this.editor(task.description) : ''}
				${task.subtasks.length ? `
					<div class="subtask-container">
						<div id="subtaskInfo">
							<p>Subtasks</p>
							<p id="numberOfSubtasks">${task.subtasks.length}</p>
							<button><span></span></button>
						</div>
						<div id="subtasks">
							${task.subtasks.map(subtask => this.subtask(subtask)).join('')}
							<div id="addSubtask">
								<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" placeholder="Add subtask..."></textarea>
								<button />
							</div>
						</div>
					</div>
				` : ''}
			</div>
		</div>
	`
	this.subtask = (subtask) => `
		<div class="subtask" id="${subtask.id}">
			<input type="checkbox">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${subtask.text}</textarea>
			<button><span></span></button>
		</div>
	`
	
	this.editor = description => `
		<div class="editor-container" id="editor-container">
			<div class="toolbar">
				<div>
					<button id="write">Write</button>
					<button id="preview">Preview</button>
				</div>
				<div>
					<span id="bold"></span>
					<span id="italic"></span>
					<span id="underline"></span>
					<span id="strikethrough"></span>
				</div>
			</div>
			<textarea class="editor" id="editor" spellcheck="false" data-enablewrite="true">${description}</textarea>
			<p id="formatedContent"></p>
			<div class="optionbar">
				<button id="save">Save</button><button id="cancel">Cancel</button>
			</div>
		</div>
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

	this.dropdown = (type, id) => `
		<div class="dropdown" id="dropdown" data-id="${id}" data-type="${type}">
			${type === 'colorBtn' ? `
				<ul class="colorList">
					<li id="yellow">Yellow</li>
					<li id="green">Green</li>
					<li id="red">Red</li>
					<li id="blue">Blue</li>
				</ul>`
			: ''}
		</div> 
	`

	
}