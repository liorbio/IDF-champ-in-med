import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import HouseCover from "./HouseCover";
import React from "react";
import HouseBoard from "./HouseBoard";
import { currentActions } from "../../../store/redux-logic";

const Leaderboard = () => {
    const scoreBoard = useAppSelector(state => state.scoreBoard);
    const viewHouseScore = useAppSelector(state => state.current.viewHouseScore);
    const dispatch = useAppDispatch();
    const houses = Object.keys(scoreBoard);
    const handleViewHouse = (h: string) => {
        dispatch(currentActions.changeHouseScoreToView(h));
    };

    return (
        <>
            {/*Object.keys(unitsPerHouse).map(h => <HouseCover key={h} house={h} leadingUnit={unitsPerHouse[h].units.filter} />)*/}
            {viewHouseScore === "none" && 
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "85vh" }}>
                    {houses.map(h => <HouseCover key={h} house={h} handleViewHouse={handleViewHouse} />)}
                </div>}
            {viewHouseScore !== "none" && <HouseBoard units={scoreBoard[viewHouseScore]} />}
        </>
    );
};

export default Leaderboard;