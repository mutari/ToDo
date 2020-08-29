function Frame(frame) {
	if(!frame) return
	this.getData = () => data
	this.getBoxes = () => boxes
	this.eject = () => queryTarget('#frame').innerHTML = ''

	const data = {
		id: frame.id,
		title: frame.title,
		description: frame.description,
		author: frame.author,
		members: frame.members.map(member => ({
			id: member.id,
			name: member.name,
			profileImgLink: member.profileImgLink,
		})),
	}
	const boxes = frame.boxes.map(box => ({
		id: box.id,
		title: box.title,
		color: box.color,
		cards: box.cards.map(card => ({
			id: card.id,
			title: card.title,
			description: card.description,
			color: card.color,
			date: card.date,
			labels: card.labels,
			members: card.members.map(member => member.id),
			subtasks: card.subtasks.map(subtask => ({
				id: subtask.id,
				text: subtask.text,
				member: subtask.member,
			})),
		}))
	}))
	const inject = () => queryTarget('#frame').innerHTML = render.frame()
	inject()
}