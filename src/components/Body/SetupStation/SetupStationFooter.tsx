import React from 'react';
import classes from './SetupStationFooter.module.css';

const SetupStationFooter = ({ devicesPerHouse }: { devicesPerHouse: Record<string, string[]> }) => {
    const housesDescription = [];
    for (const key in devicesPerHouse) {
        housesDescription.push(<React.Fragment key={key}><p><b>{key}:</b> {devicesPerHouse[key].join(", ")}</p></React.Fragment>)
    };
    return (
        <div className={classes.footer}>
            {housesDescription}
        </div>
    )
};

export default SetupStationFooter;