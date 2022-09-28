import ReactDOM from 'react-dom';
import { useState } from "react";
import TwoButtonModal from '../../UI/TwoButtonModal';
import { portalElement } from '../../../elements/portalElement';
import classes from './Unit.module.css';

const Unit = ({ unitName, saved, handleDeleteUnit }: { unitName: string, saved: boolean, handleDeleteUnit: (unitName: string) => void }) => {
    const [showDeleteUnitModal, setShowDeleteUnitModal] = useState(false);
    const [touchStartTime, setTouchStartTime] = useState(0);
    const handleTouchStart = () => {
        setTouchStartTime(new Date().getTime());
    };
    const handleTouchEnd = () => {
        if (new Date().getTime() - touchStartTime > 750) {
            setShowDeleteUnitModal(true);
        }
    };
    const handleDelete = () => {
        handleDeleteUnit(unitName);
        setShowDeleteUnitModal(false);
    }

    return (
        <>
            {showDeleteUnitModal && ReactDOM.createPortal(<TwoButtonModal prompt="מחק יחידה?" textLeft='לא' textRight='כן' colorSide='left' color='#92CBFF' activeSide='right' handleQuit={() => setShowDeleteUnitModal(false)} handleActive={handleDelete} />, portalElement)}
            <li className={`${classes.li} ${!saved && classes.unsaved}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} >{unitName}</li>
        </>
    );
};

export default Unit;