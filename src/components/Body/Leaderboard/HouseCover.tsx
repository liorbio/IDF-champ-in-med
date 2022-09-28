import classes from './Leaderboard.module.css';

const HouseCover = ({ house, handleViewHouse }: { house: string, handleViewHouse: (house: string) => void }) => {
    return (
        <div onClick={() => handleViewHouse(house)} className={classes.houseCover}>
            <h2 style={{ gridArea: "2 / 2", placeSelf: "center", fontSize: "2rem" }}>{house}</h2>
        </div>
    )
};

export default HouseCover;