import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { housesActions } from "../../../store/redux-logic";
import DeviceSticker from "./DeviceSticker";
import classes from './DevicesForStation.module.css';

const DevicesForStation = ({ house, devices, handleSaveChoices, isLast }: { house: string, devices: string[], handleSaveChoices: (house: string, devices: string[], isLast: boolean) => void, isLast: boolean }) => {
    const dispatch = useAppDispatch();
    const currentlyChooseFor = useAppSelector(state => state.houses.currentlyChooseFor);
    const show = currentlyChooseFor === house;
    const [currentChoices, setCurrentChoices] = useState<string[]>([]);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const handleStickerClick = (device: string) => {
        if (currentChoices.includes(device)) {
            if (currentChoices.length === 1) {
                setIsButtonActive(false);
            }
            setCurrentChoices(prev => prev.filter(d => d !== device));
        } else {
            if (currentChoices.length === 0) {
                setIsButtonActive(true);
            }
            setCurrentChoices(prev => [...prev, device]);
        }
    };
    const handleNextClick = () => {
        if (isButtonActive) {
            handleSaveChoices(house, currentChoices, isLast);
            dispatch(housesActions.moveToNextHouseToChooseFor());
        }
    }
    return (
        <>
        {show && <>
            <h2>{house}</h2>
            <div className={classes.stickerWrapper}>
                {devices.map(d => <DeviceSticker key={d} device={d} highlighted={currentChoices.includes(d)} handleClick={handleStickerClick} />)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div onClick={handleNextClick} className={`${classes.nextButton} ${isButtonActive ? classes.nextActive : classes.nextInactive}`}>
                    <span>הבא</span>
                    <span>&#x2190;&#xFE0E;</span>
                </div>
            </div>
        </>}
        </>
    );
};

export default DevicesForStation;