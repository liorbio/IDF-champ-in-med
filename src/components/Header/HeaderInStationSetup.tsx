import { NavigateFunction } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { housesActions } from "../../store/redux-logic";
import classes from './Header.module.css';
import NavigatorIcon from "../UI/NavigatorIcon";

const HeaderInStationSetup = ({ navigate }: { navigate: NavigateFunction }) => {
    const dispatch = useAppDispatch();
    const currentlyChooseFor = useAppSelector(state => state.houses.currentlyChooseFor);
    const devicesForHouses = useAppSelector(state => state.houses.houses);

    const prevForStationSetup = () => {
        if (currentlyChooseFor === Object.keys(devicesForHouses)[0]) {
            navigate('/');
        } else {
            dispatch(housesActions.moveToPrevHouseToChooseFor())
        }
    };

    return (
        <div className={classes.headerWrapper}>
            <NavigatorIcon icon=">" handler={prevForStationSetup} />
            <h3 style={{ color: "#303030", gridArea: "3 / 2" }}>בחירת מכשירים לכל בית</h3>
            <p style={{ color: "#303030", gridArea: "4 / 2" }}>בצעו הגדרה זו בכל טלפון שבכל תחנה</p>
        </div>
    );
};

export default HeaderInStationSetup;