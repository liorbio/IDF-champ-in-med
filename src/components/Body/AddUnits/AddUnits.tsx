import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { unitsActions } from '../../../store/redux-logic';
import HouseWithUnits from "./HouseWithUnits";

const AddUnits = ({ unitsPerHouse }: { unitsPerHouse: Record<string, { units: string[], numberOfUnitsLastSync: number }> }) => {
    const houses = useAppSelector(state => Object.keys(state.houses.houses));
    const [unitsInDOM, setUnitsInDOM] = useState<Record<string, string[]>>(() => {
        const unitsObj: Record<string, string[]> = {};
        for (const house in unitsPerHouse) {
            unitsObj[house] = unitsPerHouse[house].units;
        }
        return unitsObj;    
    });
    const [unitsToAdd, setUnitsToAdd] = useState<Record<string, string[]>>(() => {
        const unitsObj: Record<string, string[]> = {};
        for (const house in unitsPerHouse) {
            unitsObj[house] = [];
        }
        return unitsObj;    
    });

    const dispatch = useAppDispatch();
    const [housesOpen, setHousesOpen] = useState(Array.from({ length: houses.length }, x => false));

    const openHouse = (index: number) => {
        setHousesOpen(prev => {
            const newArr = [...prev];
            newArr[index] = !newArr[index];
            return newArr;
        });
    }
    // DO THIS IN HEADER UPON SYNC!!! 💡💡💡💡💡
    // const handleDeleteUnit = (house: string, unitName: string) => {
    //     setUnitsToShow(prev => {
    //         const newObj = {...prev};
    //         newObj[house].units.splice(prev[house].units.findIndex(u => u === unitName), 1);
    //         return newObj;
    //     });
    //     dispatch(unitsActions.deleteUnit({ house: house, unit: unitName }));
    // };
    const addUnitAction = (todo: "save" | "delete", house: string, unitName: string) => {
        dispatch(unitsActions.addToActionList({ whatToDo: { do: todo, house: house, unit: unitName }}));
        if (todo === "delete") {
            setUnitsInDOM(prev => {
                const newObj: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
                newObj[house].splice(newObj[house].findIndex(u => u === unitName), 1);
                return newObj;
            });
        }
    };
    const handleUpdateUnitsToAdd = (update: "delete" | "add", house: string, unitName: string) => {
        if (update === "delete") {
            setUnitsToAdd(prev => {
                const newObj: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
                newObj[house].splice(newObj[house].findIndex(u => u === unitName), 1);
                return newObj;
            });
        } else if (update === "add") {
            setUnitsToAdd(prev => {
                const newObj: Record<string, string[]> = JSON.parse(JSON.stringify(prev));
                newObj[house].push(unitName);
                return newObj;
            });
        }
    };
    return (
        <div style={{ maxWidth: "100vw", maxHeight: "85vh", overflow: "scroll" }}>
            {Object.keys(unitsInDOM).length > 0 && houses.map((h, idx) => <HouseWithUnits key={`${h}${unitsInDOM[h] || '0'}`} house={h} show={housesOpen[idx]} handleUpdateUnitsToAdd={handleUpdateUnitsToAdd} openHouse={() => openHouse(idx)} units={unitsInDOM[h]} unitsToAdd={unitsToAdd[h]} addUnitAction={addUnitAction} />)}
        </div>
    );
};

export default AddUnits;