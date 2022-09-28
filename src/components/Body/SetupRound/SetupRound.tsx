import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { currentActions } from '../../../store/redux-logic';
import UIButton from "../../UI/UIButton";

const selectStyle = { width: "50vw", height: "2.3rem", fontSize: "1.2rem", fontFamily: "Assistant", borderRadius: "10px" };

const SetupRound = () => {
    const navigate = useNavigate();
    const unitsPerHouse = useAppSelector(state => state.units.unitsPerHouse);
    const house = useAppSelector(state => state.current.house);
    const unit = useAppSelector(state => state.current.unit);
    const playersWhoPlayed = useAppSelector(state => state.current.playersWhoPlayed);
    const [preliminaryChosenHouse, setPreliminaryChosenHouse] = useState("");
    const [preliminaryChosenUnit, setPreliminaryChosenUnit] = useState("");
    const [preliminaryChosenPlayer, setPreliminaryChosenPlayer] = useState("");
    const [enterCustomUnit, setEnterCutomUnit] = useState(false);
    
    const handleBlurCustomUnitInput = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget.value !== '') {
            setPreliminaryChosenUnit(event.currentTarget.value);
        } else {
            setEnterCutomUnit(false);
        }        
    }
    useEffect(() => {
        setPreliminaryChosenHouse(house);
    }, [house]);

    const handleChangeHouse = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPreliminaryChosenHouse(event.currentTarget.value);
    };
    const handleChangeUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value === "CUSTOM") {
            setEnterCutomUnit(true);
        }
        setPreliminaryChosenUnit(event.currentTarget.value);
    };
    const handleChangePlayer = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPreliminaryChosenPlayer(event.currentTarget.value);
    };
    const dispatch = useAppDispatch();
    const houses = useAppSelector(state => state.houses.houses);
    const houseList = Object.keys(houses);
    const devicesForHouse = houses[preliminaryChosenHouse];

    const chooseUnitAndHouse = house === "" && unit === "";
    const houseAndUnitSelection = (
        <>
            <p style={{ margin: "0.3rem" }}>בית</p>
            <select onChange={handleChangeHouse} name="house" style={selectStyle}>
                <option value="">בחרו בית...</option>
                {houseList.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <p style={{ margin: "4vh 0 0.3rem" }}>היחידה הנבחנת</p>
            {!enterCustomUnit ?
                <select onChange={handleChangeUnit} name="unit" style={selectStyle}>
                    <option value="">בחרו יחידה...</option>
                    {preliminaryChosenHouse !== "" && unitsPerHouse[preliminaryChosenHouse].units.map(u => <option key={u} value={u}>{u}</option>)}
                    <option value="CUSTOM">אחר...</option>
                </select>
            :
                <input type="text" onBlur={handleBlurCustomUnitInput} style={{ width: "48vw", height: "2rem", borderRadius: "10px" }} />
            }
        </>
    );
    const players = ['1', '2', '3', '1 גיבוי', '2 גיבוי', '3 גיבוי'];
    const grayOutPlayersWhoPlayed = (p: string) => { return { color: playersWhoPlayed.includes(parseInt(p)) ? '#ccc' : '#000'}};
    const playerSelection = (
        <>
            <p style={{ margin: "0.3rem" }}>שחקן</p>
            <select onChange={handleChangePlayer} name="house" style={selectStyle}>
                <option value="">בחרו שחקן...</option>
                {players.map(p => <option key={p} value={p} style={grayOutPlayersWhoPlayed(p)}>{`${p}${playersWhoPlayed.includes(parseInt(p)) ? ' - שיחק' : ''}`}</option>)}
            </select>
        </>
    )
    const buttonHandler = () => {
        if (chooseUnitAndHouse) {
            dispatch(currentActions.enterHouseAndUnit({ house: preliminaryChosenHouse, unit: preliminaryChosenUnit }));
        } else {
            dispatch(currentActions.enterPlayer(preliminaryChosenPlayer));
            navigate('/exam');
        }
    };

    return (
        <div style={{ width: "100vw", height: "85vh" }}>
            <p style={{ marginTop: 0, paddingTop: "4vh" }}>בתחנה זו נבחנים על:</p>
            <div style={{ minHeight: "14vh", display: "flex", flexDirection: "column", placeContent: "center" }}>
                {devicesForHouse ? devicesForHouse.map((d, idx) => <p key={idx+house} style={{ margin: "0.3rem", fontWeight: "bold", fontSize: "2.2rem" }}>{d}</p>) : 
                <p style={{ fontSize: "2.5rem", lineHeight: 1 }}>...</p>}
            </div>
            {chooseUnitAndHouse && houseAndUnitSelection}
            {!chooseUnitAndHouse && playerSelection}
            <UIButton label="המשך" active={(chooseUnitAndHouse && preliminaryChosenHouse !== "" && preliminaryChosenUnit !== "") || (!chooseUnitAndHouse && preliminaryChosenPlayer !== "")} handler={buttonHandler} />
        </div>
    );
};

export default SetupRound;