import './App.scss';
import { Routes, Route } from 'react-router-dom';
import { ContainerAddMeme } from './pages/addMeme/ContainerAddMeme';
import { Memes } from './pages/main/Main';
import { Hot } from './pages/hot/Hot';

function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Memes />}></Route>
				<Route path='/hot' element={<Hot />}></Route>
				<Route path='/add-meme' element={<ContainerAddMeme />}></Route>
			</Routes>
		</div>
	);
}

export default App;
