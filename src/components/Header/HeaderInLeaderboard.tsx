import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { currentActions } from "../../store/redux-logic";
import classes from './Header.module.css';
import NavigatorIcon from "../UI/NavigatorIcon";

const HeaderInLeaderboard = () => {
    const navigate = useNavigate();
    const viewHouseScore = useAppSelector(state => state.current.viewHouseScore);
    const dispatch = useAppDispatch();
    const prevForLeaderboard = () => {
        if (viewHouseScore === "none") {
            navigate('/');
        } else {
            dispatch(currentActions.changeHouseScoreToView("none"));
        }
    }
    return (
        <div className={classes.headerWrapper}>
            <NavigatorIcon icon=">" handler={prevForLeaderboard} />
            <h1 style={{ gridArea: "3 / 2", color: "#303030" }}>טבלת ניקוד</h1>
            {viewHouseScore !== "none" && <h3 style={{ gridArea: "2 / 2", color: "#303030" }}>{viewHouseScore}</h3>}
        </div>
    );
};

export default HeaderInLeaderboard;