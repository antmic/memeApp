import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import './Main.scss';
import styles from './styles.module.css';

export function Memes() {
	const [memes, setMemes] = useState([]);
	const [shownMemeIndex, setShownMemeIndex] = useState(0);
	const [numberOfMemes, setNumberOfMemes] = useState(0);
	const [greenActive, setGreenActive] = useState(false);
	const [redActive, setRedActive] = useState(false);
	const [allActive, setAllActive] = useState(true);
	const [hotActive, setHotActive] = useState(false);

	async function getMemes(num) {
		let result = await fetch('http://127.0.0.1:3002/' + num);
		result = await result.json();
		setMemes([...memes, ...result.memes]);
		setTimeout(function () {}, 1000);
	}

	useEffect(() => {
		getMemes(3);
	}, []);

	useEffect(() => {
		getMemes(1);
	}, [numberOfMemes]);

	async function nextMeme() {
		setGreenActive(false);
		setRedActive(false);
		document.getElementById('prevBtn').disabled = false;
		if (numberOfMemes === shownMemeIndex || numberOfMemes === shownMemeIndex - 1) {
			setNumberOfMemes(numberOfMemes + 1);
		}
		setShownMemeIndex(shownMemeIndex + 1);
	}

	const prevMeme = () => {
		setGreenActive(false);
		setRedActive(false);
		if (shownMemeIndex > 1) {
			setShownMemeIndex(shownMemeIndex - 1);
		} else if (shownMemeIndex === 1) {
			setShownMemeIndex(shownMemeIndex - 1);
			document.getElementById('prevBtn').disabled = true;
		}
	};

	async function upvote() {
		if (greenActive === false) {
			setGreenActive(true);
			let result = await fetch('http://127.0.0.1:3002/upvote', {
				method: 'post',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					vote: 1,
					id: memes[shownMemeIndex]._id,
				}),
			});

			result = await result.json();
			let newMemes = [...memes];
			newMemes[shownMemeIndex].upvotes = result.newVote;
			setMemes(newMemes);
		} else {
			//deactivates greenActive and retracts upvote
			setGreenActive(false);
			let result = await fetch('http://127.0.0.1:3002/upvote', {
				method: 'post',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					vote: -1,
					id: memes[shownMemeIndex]._id,
				}),
			});
			result = await result.json();
			let newMemes = [...memes];
			newMemes[shownMemeIndex].upvotes = result.newVote;
			setMemes(newMemes);
		}
	}

	async function downvote() {
		if (redActive === false) {
			setRedActive(true);
			let result = await fetch('http://127.0.0.1:3002/downvote', {
				method: 'post',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					vote: 1,
					id: memes[shownMemeIndex]._id,
				}),
			});
			result = await result.json();
			let newMemes = [...memes];
			newMemes[shownMemeIndex].downvotes = result.newVote;
			setMemes(newMemes);
		} else {
			//deactivates redActive and retracts upvote
			setRedActive(false);
			let result = await fetch('http://127.0.0.1:3002/downvote', {
				method: 'post',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					vote: -1,
					id: memes[shownMemeIndex]._id,
				}),
			});
			result = await result.json();
			let newMemes = [...memes];
			newMemes[shownMemeIndex].downvotes = result.newVote;
			newMemes[shownMemeIndex].clicked = false;
			setMemes(newMemes);
		}
	}

	let navigate = useNavigate();
	const routeChangeToHot = () => {
		let path = `/hot`;
		navigate(path);
	};
	const routeChangeToAll = () => {
		let path = `/`;
		navigate(path);
	};

	return (
		<div className='App'>
			<Link to='/add-meme' className='addMemeLink'>
				Add Meme
			</Link>
			<div className='hotRegBtns'>
				<button
					id='hotBtn'
					onClick={routeChangeToHot}
					className={classNames({
						[styles.Clicked]: hotActive,
					})}>
					Hot
				</button>
				<button
					id='allBtn'
					onClick={routeChangeToAll}
					className={classNames({
						[styles.Clicked]: allActive,
					})}>
					All
				</button>
			</div>
			<div className='imageTitle'>
				{memes.length > shownMemeIndex ? <p>{memes[shownMemeIndex].name}</p> : <p>Loading...</p>}
			</div>
			<div className='image'>
				{memes.length > shownMemeIndex ? <img src={memes[shownMemeIndex].url} alt='meme' /> : <p>Loading...</p>}
			</div>
			{/* {shownMemeIndex} */}
			<div className='btns'>
				<button id='prevBtn' onClick={prevMeme}>
					<img src={window.location.origin + '/images/small-left-arrow.png'} alt='left arrow' />
				</button>
				<button
					id='upvoteBtn'
					onClick={upvote}
					className={classNames({
						[styles.Green]: greenActive,
					})}>
					{memes.length > shownMemeIndex ? (
						<span>Upvote: {memes[shownMemeIndex].upvotes}</span>
					) : (
						<span>Loading...</span>
					)}
				</button>
				<button
					id='downvoteBtn'
					onClick={downvote}
					className={classNames({
						[styles.Red]: redActive,
					})}>
					{memes.length > shownMemeIndex ? (
						<span>Downvote: {memes[shownMemeIndex].downvotes}</span>
					) : (
						<span>Loading...</span>
					)}
				</button>
				<button id='nextBtn' onClick={nextMeme}>
					{' '}
					<img src={window.location.origin + '/images/small-right-arrow.png'} alt='right arrow' />
				</button>
			</div>
		</div>
	);
}
