import { CSSProperties } from 'react';
import classes from './HouseWithUnits.module.css';
import Unit from './Unit';

const ulStyle: CSSProperties = {
    listStyleType: "none",
    paddingRight: "3vw",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start"
};

const HouseWithUnits = ({ house, units, unitsToAdd, handleUpdateUnitsToAdd, show, openHouse, addUnitAction }: { house: string, units: string[], unitsToAdd: string[], handleUpdateUnitsToAdd: (update: "delete" | "add", house: string, unitName: string) => void, show: boolean, openHouse: () => void, addUnitAction: (todo: "save" | "delete", house: string, unitName: string) => void }) => {
    const deleteUnitGivenHouse = (unitName: string) => {
        addUnitAction("delete", house, unitName);
    }
    const deleteUnitToAdd = (unitName: string) => {
        handleUpdateUnitsToAdd("delete", house, unitName);
    };
    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget.value !== "") {
            handleUpdateUnitsToAdd("add", house, event.currentTarget.value)
            addUnitAction("save", house, event.currentTarget.value);
            event.currentTarget.value = "";
        }
    };

    return (
        <div className={classes.houseWrapper}>
            <div className={classes.houseTitle} onClick={openHouse}>
                <span style={{ fontWeight: "bold" }}>{house}</span>
                {show && <span style={{ marginLeft: "4vw" }}>&#x25BC;&#xFE0E;</span>}
                {!show && <span style={{ marginLeft: "4vw" }}>&#x25C0;&#xFE0E;</span>}
            </div>
            {show && <div className={classes.unitsAndInput}>
                <input type="text" onBlur={handleInputBlur} placeholder={`הוסף יחידת ${house}`} />
                <ul style={ulStyle}>
                    {units.map(u => <Unit key={u} saved={true} unitName={u} handleDeleteUnit={deleteUnitGivenHouse} />)}
                    {unitsToAdd.length > 0 && unitsToAdd.map((u, idx) => <Unit key={`${u}${idx}`} saved={false} unitName={u} handleDeleteUnit={deleteUnitToAdd} />)}
                </ul>
            </div>}
        </div>
    );
};

export default HouseWithUnits;