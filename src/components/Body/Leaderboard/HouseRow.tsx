type ScoresObject = Record<string, { cloudStatus: "local" | "imported" | "uploaded", scores: number[] }>;
type Device = Record<string, ScoresObject>;
type Unit = Record<string, Device>;

const HouseRow = ({data}: {data: Unit }) => {
    const unit = Object.keys(data)[0];
    const dev = Object.keys(data[unit]);
    console.dir(data[unit]);
    return (
        <> 
            <h1>{unit}</h1>
            {dev}
        </>
    );
};

export default HouseRow;