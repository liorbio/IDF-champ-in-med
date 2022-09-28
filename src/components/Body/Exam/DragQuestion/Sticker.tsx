import React, { useState, useRef, CSSProperties } from 'react';
import classes from './Sticker.module.css';
import { blanksCoords } from './DragQuestion';

const landingSpotsCoords = [
    { left: "53.5vw", top: "50.5vh" },
    { left: "3.5vw", top: "50.5vh" },
    { left: "53.5vw", top: "58.25vh" },
    { left: "3.5vw", top: "58.25vh" },
    { left: "53.5vw", top: "66vh" },
    { left: "3.5vw", top: "66vh" }
];

type VwvhCoord = { left: string, top: string };
type PixelCoord = { left: number, top: number };
type UpdateBlanksStatusFuncType = (prevBlank: number, currentBlank?: number, correctBlank?: boolean) => void;
type UpdateStickerPlaceFuncType = (stickerId: number, newPlace: number) => void;
type UpdateStickersValuesFuncType = (blankId: number, numberInImagePutOnThisBlank: number) => void;

const Sticker = ({ stickerText, numberInImage, stickerRadii, numberOfStickers, blanksStatus, handleUpdateBlanksStatus, gridArea, stickerPlace, stickerId, handleUpdateStickerPlace, handleUpdateBlanksValues }: { stickerText: string, numberInImage: number, stickerRadii: PixelCoord, numberOfStickers: number, blanksStatus: number[], handleUpdateBlanksStatus: UpdateBlanksStatusFuncType, gridArea: string, stickerPlace: number, stickerId: number, handleUpdateStickerPlace: UpdateStickerPlaceFuncType, handleUpdateBlanksValues: UpdateStickersValuesFuncType }) => {
    const stickerRef = useRef<HTMLDivElement>(null);
    const initialCoords = stickerPlace === 0 ? { left: "0", top: "0"} : landingSpotsCoords[stickerPlace-1];
    const [currentCoords, setCurrentCoords] = useState<PixelCoord | VwvhCoord>(initialCoords);
    const [moving, setMoving] = useState(false);

    const handleDrag = (event: React.TouchEvent<HTMLDivElement>) => {
        const {clientX, clientY} = event.changedTouches[0];
        setMoving(true);
        setCurrentCoords({ left: clientX - 1*stickerRadii.left, top: clientY - 1*stickerRadii.top});
    }

    const handleLeave = (event: React.TouchEvent<HTMLDivElement>) => {
        const {clientX, clientY} = event.changedTouches[0];
        // check if a blank space is vacant
        // then check if sticker landed in blank area
        let stickerDidntLandInAnySpot = false;
        for (var i = 0; i < numberOfStickers; i++) {
            if (blanksStatus[i] === 0 && clientX > blanksCoords[i].left && clientX < blanksCoords[i].right && clientY > blanksCoords[i].top + 2*stickerRadii.top && clientY < blanksCoords[i].bottom + 2*stickerRadii.top) {
                setMoving(false);
                handleUpdateStickerPlace(stickerId, i+1); 
                if (numberInImage === i+1) {  // numberInImage goes from 1,2,3... and i goes 0,1,2... - that's why we equate with i+1
                    handleUpdateBlanksStatus(stickerPlace, i, true);
                } else {
                    handleUpdateBlanksStatus(stickerPlace, i, false);
                }
                //setCurrentCoords({ left: landingSpotsCoords[i].left, top: landingSpotsCoords[i].top });
                setCurrentCoords(landingSpotsCoords[i]);
                handleUpdateBlanksValues(i, numberInImage);
                break;
            }
            if (i === numberOfStickers - 1) {
                    stickerDidntLandInAnySpot = true;
            }
        }
        if (stickerDidntLandInAnySpot) {
            setCurrentCoords({ left: 0, top: 0});
            setMoving(false);
            handleUpdateStickerPlace(stickerId, 0);
            handleUpdateBlanksStatus(stickerPlace);
        }
    }
    const stickerStyle: CSSProperties = {
        left: currentCoords.left,
        top: currentCoords.top,
        position: moving || stickerPlace > 0 ? "fixed" : "inherit",
        marginRight: "3.5vw",
        gridArea: gridArea
    };

    return (
        <div style={stickerStyle} className={classes.sticker} onTouchMove={handleDrag} onTouchEnd={handleLeave} ref={stickerRef}>
            {stickerPlace > 0 && <span>{stickerPlace}</span>}
            <p>{stickerText}</p>
        </div>
    )
};

export default Sticker;