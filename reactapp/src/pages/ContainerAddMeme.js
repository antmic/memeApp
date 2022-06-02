import { AddMeme } from './AddMeme';

export const ContainerAddMeme = () => {
    const onInput = (input) => {
        console.log(input);
    };

    return (
        <div>
            <AddMeme onInput={onInput} />
        </div>
    );
};