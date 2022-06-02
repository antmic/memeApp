import './App.scss';
import { Routes, Route, Link } from 'react-router-dom';
import { ContainerAddMeme } from './pages/addMeme/ContainerAddMeme';
import {Memes} from './pages/main/Main'

function App() {
	return (
		<div className='App'>

			<Routes>
				<Route path="/" element={<Memes />}></Route>
				<Route path='/add-meme' element={<ContainerAddMeme></ContainerAddMeme>}></Route>
			</Routes>
		</div>
	);
}

export default App;
