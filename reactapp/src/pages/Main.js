import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './styles.module.css';

export function Memes() {
	const [memes, setMemes] = useState([]);
	const [isHot, setIsHot] = useState(false);
	const [shownMemeIndex, setShownMemeIndex] = useState(0);
	const [numberOfMemes, setNumberOfMemes] = useState(0);

	async function getMemes(num, hot = '') {
		let result = await fetch('http://127.0.0.1:3002/' + hot + num);
		result = await result.json();
		setMemes([...memes, ...result.memes]);
	}

	useEffect(() => {
		if (isHot) {
			console.log('isHot is: ', isHot);
			getMemes(10, 'hot/');
		} else {
			console.log('isHot is: ', isHot);
			getMemes(10);
		}
	}, [isHot]);

	function toggleHotMemes() {
		setIsHot(true);
		setMemes([]);
	}
	function toggleRegularMemes() {
		setIsHot(false);
		setMemes([]);
	}

	async function nextMeme() {
		setGreenActive(false);
		setRedActive(false);
		document.getElementById('prevBtn').disabled = false;
		if (memes.length > shownMemeIndex + 1 && memes.length < shownMemeIndex + 10) {
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
			if (isHot) {
				await getMemes(1, 'hot/');
			} else {
				await getMemes(1);
			}
		} else if (memes.length > shownMemeIndex + 1) {
			setNumberOfMemes(numberOfMemes + 1);
			setShownMemeIndex(shownMemeIndex + 1);
		} else {
			if (isHot) {
				await getMemes(10, 'hot/');
			} else {
				await getMemes(10);
			}
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
	const [greenActive, setGreenActive] = useState(false);
	async function upvote() {
		setGreenActive(!greenActive);
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

	const [redActive, setRedActive] = useState(false);
	async function downvote() {
		setRedActive(!redActive);
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
			<div className='hotRegBtns'>
				<button id='hotBtn' onClick={toggleHotMemes}>
					Hot
				</button>
				<button id='regBtn' onClick={toggleRegularMemes}>
					Regular
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
