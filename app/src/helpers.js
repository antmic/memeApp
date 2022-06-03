export async function postVote(server, vote, id) {
	const result = await fetch(server, {
		method: 'post',
		headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
			vote: vote,
			id: id,
		}),
	});
	return result
}
