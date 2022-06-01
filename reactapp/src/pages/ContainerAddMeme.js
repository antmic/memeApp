import { AddMeme } from './AddMeme';

export const ContainerAddMeme = () => {
    const onSearchTerm = (searchTerm) => {
        console.log(searchTerm);
    };

    return (
        <div>
            <AddMeme onSearchTerm={onSearchTerm} />
        </div>
    );
};