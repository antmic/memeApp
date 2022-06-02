import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddMeme = props => {
	const [memeUrl, setMemeUrl] = useState('');
	const [memeTitle, setMemeTitle] = useState('');
	const navigate = useNavigate();

	const InputHandler = () => {
		props.onInput(memeUrl);
		props.onInput(memeTitle);
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
		navigate('/');
	};
	return (
		<div className='inputDiv'>
			<input className='input' value={memeTitle} placeholder='title' onChange={event => setMemeTitle(event.target.value)}></input>
			<input className='input' value={memeUrl} placeholder='link' onChange={event => setMemeUrl(event.target.value)}></input>
			<button className='inputBtn' onClick={InputHandler}>Add meme</button>
		</div>
	);
};
