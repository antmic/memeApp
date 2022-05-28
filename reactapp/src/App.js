import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
	const [memes, setMemes] = useState([]);
	const [shownMemeIndex, setShownMemeIndex] = useState(0);
	const [numberOfMemes, setNumberOfMemes] = useState(0);

	async function getMemes(num) {
		let result = await fetch('http://127.0.0.1:3001/' + num);
		result = await result.json();
		setMemes([...memes, ...result.memes]);
	}

	useEffect(() => {
		getMemes(10);
	}, []);

	console.log(memes);

	async function nextMeme() {
		if (memes.length > shownMemeIndex + 1) {
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
			await getMemes(1);
		} else {
			await getMemes(10);
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
		}
	}

	const prevMeme = () => {
		setShownMemeIndex(shownMemeIndex - 1);
	};

	return (
		<div className='App'>
			<div>
				{shownMemeIndex}
				<button onClick={nextMeme}>Next</button>
				<button onClick={prevMeme}>Previous</button>
			</div>
			{memes.length > shownMemeIndex ? <img src={memes[shownMemeIndex].url} alt='meme' /> : <p>Loading...</p>}
		</div>
	);
}

export default App;
