import classes from './Header.module.css';

const HeaderTimesUp = ({ house, unit, player }: { house: string, unit: string, player: string }) => {
    return (
        <div className={classes.headerWrapper} style={{ backgroundColor: "#fff" }}>
            <p  style={{ margin: 0, gridArea: "2 / 1", fontSize: "0.8rem", fontWeight: "bold"}}>00:00</p>
            <h2 style={{ margin: 0, gridArea: "3 / 2", color: "#303030" }}>{`${house} - ${unit}`}</h2>
            <h4 style={{ margin: 0, gridArea: "4 / 2", color: "#303030", fontWeight: 500 }}>{`שחקן ${player}`}</h4>
        </div>
    );
};

export default HeaderTimesUp;