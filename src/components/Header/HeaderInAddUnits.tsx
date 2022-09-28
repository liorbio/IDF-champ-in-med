import { useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './Header.module.css';
import { NavigateFunction } from 'react-router-dom';
import { portalElement } from '../../elements/portalElement';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { unitsActions } from '../../store/redux-logic';
import NavigatorIcon from "../UI/NavigatorIcon";
import TwoButtonModal from "../UI/TwoButtonModal";

const HeaderInAddUnits = ({ navigate }: { navigate: NavigateFunction }) => {
    const dispatch = useAppDispatch();
    const actionsBeforeSync = useAppSelector(state => state.units.actionsBeforeSync);
    const [showExitAddUnitsModal, setShowExitAddUnitsModal] = useState(false);
    const pressPrevAddUnits = () => {
        if (actionsBeforeSync.length === 0) {
            navigate('/');
        } else {
            setShowExitAddUnitsModal(true);
        }
    };
    const handleExitWithoutSync = () => {
        dispatch(unitsActions.emptyActionList());
        setShowExitAddUnitsModal(false);
        navigate('/');
    }
    return (
        <div className={classes.headerWrapper}>
            {showExitAddUnitsModal && ReactDOM.createPortal(<TwoButtonModal prompt='לצאת ללא סנכרון? השינויים שבוצעו לא יישמרו' textLeft='לא' textRight='כן' colorSide='left' color='#B91118' activeSide='right' handleQuit={() => setShowExitAddUnitsModal(false)} handleActive={handleExitWithoutSync} />, portalElement)}
            <NavigatorIcon icon=">" handler={pressPrevAddUnits} />
            <h2 style={{ gridArea: "3 / 2" }}>הזנת יחידות</h2>
            <h1 style={{ gridArea: "3 / 3", fontWeight: 600 }}>&#x27F3;&#xFE0E;</h1>
        </div>
    );
};

export default HeaderInAddUnits;