import { useState } from 'react';

export const AddMeme = props => {
	const [memeUrl, setMemeUrl] = useState('');
	const [memeTitle, setMemeTitle] = useState('');
	const inputHandler = () => {
		props.onSearchTerm(memeUrl);
		props.onSearchTerm(memeTitle);
		async function sendMeme() {
			let result = await fetch('http://127.0.0.1:3002/add', {
				method: 'post',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url: memeUrl,
					name: memeTitle,
				}),
			});
			result = await result.json();
			console.log(result.message);
		}
		sendMeme();
		setMemeTitle('');
		setMemeUrl('');
	};
	return (
		<div>
			Paste link to meme:
			<input value={memeTitle} placeholder='Meme title' onChange={event => setMemeTitle(event.target.value)}></input>
			<input value={memeUrl} placeholder='Link to meme' onChange={event => setMemeUrl(event.target.value)}></input>
			<button onClick={inputHandler}>Add meme</button>
		</div>
	);
};
