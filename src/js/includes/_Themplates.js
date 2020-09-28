function Themplates() {
	this.frame = ({id, text}, boxes) => `
		<nav class="frameNav" id="frameNav" data-id="${id}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="2">${text}</textarea>
		</nav>
		<div class="frame" id="frame" data-id="${id}">${boxes ? boxes.map(box => this.box(box)).join('') : ''}</div>
	`
	this.box = ({id, tasks, text, posId}) => `
		<ul class="box" id="box" draggable="true" data-id="${id}" data-pos="${posId}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
			<button id="create" data-type="task">+</button>
			${tasks ? tasks.map(task => this.task(task)).join('') : ''}
			<span id="boxAdd" data-partnerId="${id}" />
		</ul>
	`
	this.task = ({id, text, color, posId, subtasks}) => `
		<li class="task ${color !== 'default' ? `color-${color}` : ''}" id="task" draggable="true"  data-id="${id}" data-pos="${posId}">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
			${subtasks && subtasks.length ? `<div style="display: none" id="hiddenSubtask">${subtasks.map(subtask=>this.subtask(subtask))}</div>` : ''}
		</li>
	`
	this.taskLarge = ({color, parent, id, text, description, subtasks, labels, members}) => `
		<div class="taskLarge-container ${color !== 'default' ? `color-${color}` : ''}" id="taskLarge-container">
			<div class="taskLarge" id="taskLarge"  data-id="${id}">
				<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" draggable="false">${text ? text : ''}</textarea>
				<p>In <b>${parent}</b></p>
				<div class="info" data-id="${id}">
					<div class="color">
						<label>Color</label>
						<button id="colorBtn"><span class="circle"></span><span id="colorBtn_text">${color ? tools.capitalizeFirstLetter(color) : color}</span></button>
					</div>
					<div class="members">
						<label>Members</label>
						<div>
							<div>
								<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
								<span>
							</div>
							<div>
								<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" /></div>
								<span>
							</div>
							<button id="membersBtn" />
						</div>
					</div>
					<div class="labels">
						<label>Labels</label>
						<div id="labels">
							${labels ? labels.map(label=>this.label(label)) : ''}
							<button id="labelsBtn" />
						</div>
					</div>
				</div>
				${description ? this.editor(description) : ''}
				${subtasks && subtasks.length ? this.subtaskContainer(subtasks) : ''}
			</div>
		</div>
	`

	this.subtaskContainer = subtasks => `
		<div class="subtask-container">
			<div id="subtaskInfo">
				<p>Subtasks</p>
				<p id="numberOfSubtasks">${subtasks.length}</p>
				<button><span></span></button>
			</div>
			<div id="subtasks">
				${subtasks.map(subtask => this.subtask(subtask)).join('')}
				<div id="addSubtask">
					<textarea id="textarea" type="text" readonly spellcheck="false" rows="1" placeholder="Add subtask..."></textarea>
					<button />
				</div>
			</div>
		</div>
	`

	this.subtask = ({id, text, posId}) => `
		<div class="subtask" data-id="${id}" data-pos="${posId}">
			<input type="checkbox">
			<textarea id="textarea" type="text" readonly spellcheck="false" rows="1">${text}</textarea>
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
	this.label = ({text, id}) => `
		<div data-id="${id}"><p>${text}</p><span></div>
	`


	this.contextMenu = (id, type) => `
		<nav class="context-menu" id="context-menu">${console.log(type)}
			<ul data-id="${id}" data-type="${type}">
				${!['frame', 'frameNav', 'label'].includes(type) ? '<li id="read">View</li>' : ''}
				${type === 'box' ? '<li id="create">Add</li>' : ''}
				<li id="update">Edit</li>
				${!['frame', 'frameNav'].includes(type) ? '<li id="delete">Delete</li>' : ''}
			</ul>
		</nav>
	`

	this.dropdown = (type, id) => `
		<div class="dropdown" id="dropdown" data-id="${id}" data-type="${type}">
			${type === 'colorBtn' ? `
				<ul class="colorList" id="colorList">
					<li id="color-yellow">Yellow</li>
					<li id="color-green">Green</li>
					<li id="color-red">Red</li>
					<li id="color-blue">Blue</li>
					<li id="color-crimson">Crimson</li>
					<li id="color-indigo">Indigo</li>
					<li id="color-defualt">Default</li>
				</ul>`
			: ''}
			<div>
				${type === 'labelsBtn' ? `
					<div id="input-container">
						<input id="labelInput" placeholder="add label...">
						<button id="labelBtn" />
					</div>
					`
				: ''}
				${type === 'membersBtn' ? `
					<div id="membersList">
						${
							frame.boxes.find(box => (
								box.id === queryTarget(`.task[data-id="${id}"]`).parentElement.attributes['data-id'].value
							)).tasks.find(task => (
								task.id === id 
							)).members.map(({id, text, url}) => `
								<div class="img" data-id="${id}" data-name="${text}">
									<div class="img"><img src="${url}"></div>
									<span>${text}</span>
								</div>
							`)
						}
						<div>
							<div class="img"><img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"></div>
							<span>
						</div>
					</div>
					<div id="input-container">
						<input id="membersInput" placeholder="Email...">
						<button id="inviteMembersBtn" />
					</div>
					`
				: ''}
			</div>
		</div> 
	`

	
}