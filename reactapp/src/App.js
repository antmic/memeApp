import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ContainerAddMeme } from './pages/ContainerAddMeme';

function App() {
	const [memes, setMemes] = useState([]);
	const [shownMemeIndex, setShownMemeIndex] = useState(0);
	const [numberOfMemes, setNumberOfMemes] = useState(0);

	async function getMemes(num) {
		let result = await fetch('http://127.0.0.1:3002/' + num);
		result = await result.json();
		setMemes([...memes, ...result.memes]);
	}

	useEffect(() => {
		getMemes(10);
	}, []);

	async function nextMeme() {
		document.getElementById('prevBtn').disabled = false;
		if (memes.length > shownMemeIndex + 1 && memes.length < shownMemeIndex + 10) {
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
			await getMemes(1);
		} else if (memes.length > shownMemeIndex + 1) {
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
		} else {
			await getMemes(10);
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
		}
	}

	const prevMeme = () => {
		if (shownMemeIndex > 1) {
			setShownMemeIndex(shownMemeIndex - 1);
		} else if (shownMemeIndex === 1) {
			setShownMemeIndex(shownMemeIndex - 1);
			document.getElementById('prevBtn').disabled = true;
		}
	};

	async function upvote() {
		let result = await fetch('http://127.0.0.1:3002/upvote', {
			method: 'post',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({
				vote: 1,
				id: memes[shownMemeIndex]._id,
			}),
		});

		result = await result.json();
		console.log('result.message is: ', result.message);
		console.log('result.newVote is: ', result.newVote);
		let newMemes = [...memes];
		newMemes[shownMemeIndex].upvotes = result.newVote;
		setMemes(newMemes);
	}

	async function downvote() {
		let result = await fetch('http://127.0.0.1:3002/downvote', {
			method: 'post',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({
				vote: -1,
				id: memes[shownMemeIndex]._id,
			}),
		});

		result = await result.json();
		console.log('result.message is: ', result.message);
		console.log('result.newVote is: ', result.newVote);
		let newMemes = [...memes];
		newMemes[shownMemeIndex].downvotes = result.newVote;
		setMemes(newMemes);
	}

	return (
		<div className='App'>
			{/* <Link to='/'>Main</Link> */}
			<Link to='/add-meme'>Add Meme</Link>
			<Routes>
				{/* <Route path='/' element={<App />}></Route> */}
				<Route path='/add-meme' element={<ContainerAddMeme></ContainerAddMeme>}></Route>
			</Routes>
			<div>
				{shownMemeIndex}
				<button id='prevBtn' onClick={prevMeme}>
					Previous
				</button>
				<button id='nextBtn' onClick={nextMeme}>
					Next
				</button>
				{memes.length > shownMemeIndex ? <p>{memes[shownMemeIndex].name}</p> : <p>Loading...</p>}
				{memes.length > shownMemeIndex ? <p>Upvotes: {memes[shownMemeIndex].upvotes}</p> : <p>Loading...</p>}
				{memes.length > shownMemeIndex ? <p>Downvotes: {memes[shownMemeIndex].downvotes}</p> : <p>Loading...</p>}
				<button id='upvoteBtn' onClick={upvote}>
					Upvote
				</button>
				<button id='downvoteBtn' onClick={downvote}>Downvote</button>
			</div>
			{memes.length > shownMemeIndex ? <img src={memes[shownMemeIndex].url} alt='meme' /> : <p>Loading...</p>}
		</div>
	);
}

export default App;
