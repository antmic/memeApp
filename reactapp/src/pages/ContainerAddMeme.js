import { AddMeme } from './AddMeme';
import { Link } from 'react-router-dom';

export const ContainerAddMeme = () => {
	const onInput = input => {
		console.log(input);
	};

	return (
		<div>
			<Link to='/'>See Meme</Link>
			<AddMeme onInput={onInput} />
		</div>
	);
};
