import { AddMeme } from './AddMeme';
import { Link } from 'react-router-dom';

export const ContainerAddMeme = () => {
	const onInput = input => {
		console.log(input);
	};

	return (<div className='addMemeDiv'>
		<div className='backLinkDiv'>
			<Link className='backLink' to='/'>
				Back
			</Link>
		</div>
		<div className='inputDiv'>
			<AddMeme onInput={onInput} />
		</div>
	</div>
	);
};
