import UnitRow from "./UnitRow";

type ScoresObject = Record<string, { cloudStatus: "local" | "imported" | "uploaded", scores: number[] }>;
type Device = Record<string, ScoresObject>;
type Unit = Record<string, Device>;

const HouseBoard = ({ units }: { units: Unit }) => {

    return (
        <div style={{ maxHeight: "85vh", overflowY: "scroll", display: "flex", flexDirection: "column" }}>
            {Object.keys(units).map(unitName => <UnitRow key={unitName} unitName={unitName} unitDevices={units[unitName]} />)}
        </div>
    );
};

export default HouseBoard;