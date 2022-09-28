import classes from './OneChoice.module.css';

const OneChoice = ({ itemNumber, handleChoose, text, chosen }: { itemNumber: number, handleChoose: (num: number) => void, text: string, chosen: boolean }) => {

    const handleClick = () => {
        handleChoose(itemNumber);
    }
    return (
        <div onClick={handleClick} className={`${classes.choice} ${chosen && classes.chosen}`}>{text}</div>
    );
}

export default OneChoice;