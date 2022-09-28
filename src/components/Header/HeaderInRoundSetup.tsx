import { NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { currentActions } from "../../store/redux-logic";
import classes from './Header.module.css';
import NavigatorIcon from "../UI/NavigatorIcon";

const HeaderInRoundSetup = ({ house, unit, navigate }: { house: string, unit: string, navigate: NavigateFunction }) => {
    const dispatch = useAppDispatch();
    
    const prevForRoundSetup = () => {
        if (house !== "" && unit !== "") { // go back from choose player to choose house/unit
            dispatch(currentActions.clearHouseAndUnit());
            dispatch(currentActions.clearPlayersWhoPlayed());
        } else {
            navigate('/');
            
        }
    };
    
    return (
        <div className={classes.headerWrapper} style={{ backgroundColor: "#fff" }}>
            <NavigatorIcon icon=">" handler={prevForRoundSetup} />
            {house !== "" && unit !== "" && <h2 style={{ margin: 0, gridArea: "3 / 2", color: "#303030" }}>{`${house} - ${unit}`}</h2>}
        </div>
    );
};

export default HeaderInRoundSetup;