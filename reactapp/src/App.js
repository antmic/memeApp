import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { ContainerAddMeme } from './pages/ContainerAddMeme';
import {Memes} from './pages/Main'

function App() {
	return (
		<div className='App'>
			<Link to='/'>See Meme</Link>
			<Link to='/add-meme'>Add Meme</Link>
			<Routes>
				<Route path="/" element={<Memes />}></Route>
				<Route path='/add-meme' element={<ContainerAddMeme></ContainerAddMeme>}></Route>
			</Routes>
		</div>
	);
}

export default App;
