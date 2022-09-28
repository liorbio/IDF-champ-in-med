import { NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks";
import { cloudActions, scoreBoardActions } from "../../store/redux-logic";
import classes from './Header.module.css';
import NavigatorIcon from "../UI/NavigatorIcon";

const HeaderInCloudStatus = ({ navigate }: { navigate: NavigateFunction }) => {  
    const dispatch = useAppDispatch();

    const prevForCloudStatus = () => {
        navigate('/');
    }
    const getDeviceScoresFromCloud = async () => {
        try {
            const response = await fetch('/', { mode: "cors" });
            const data = await response.json();
            for (const deviceScore of data.data) {
                dispatch(scoreBoardActions.addDeviceToUnitFromCloud({
                    house: deviceScore.house,
                    unit: deviceScore.unit,
                    device: deviceScore.deviceName,
                    scoreTable: deviceScore.scoreTable,
                    maxPointsPerQuestion: deviceScore.maxScorePerQuestion
                }));
            }
            dispatch(cloudActions.updatePhoneList(data.phones));
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <div className={classes.headerWrapper}>
            <NavigatorIcon icon=">" handler={prevForCloudStatus} />
            <h2 style={{ gridArea: "3 / 2", color: "#303030" }}>קבלת נתונים מהענן</h2>
            <h1 style={{ gridArea: "3 / 3" }} onClick={getDeviceScoresFromCloud}>&#x2193;&#xFE0E;</h1>
        </div>
    )
};

export default HeaderInCloudStatus;