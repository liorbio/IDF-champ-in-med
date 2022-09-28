import ModalBackgroundClicksPrevention from "./ModalBackgroundClicksPrevention";
import classes from './CodeModal.module.css';
import { useState, useRef, useEffect, KeyboardEventHandler } from "react";

const CodeModal = ({ text, requiredCodes, proceed, goBack, topForBackground }: { text: string, requiredCodes: string[], proceed: () => void, goBack: () => void, topForBackground: number }) => {
    const [insertedCode, setInsertedCode] = useState("");

    const pinOne = useRef<HTMLInputElement>(null);
    const pinTwo = useRef<HTMLInputElement>(null);
    const pinThree = useRef<HTMLInputElement>(null);
    const pinFour = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (pinOne.current) {
            pinOne.current.focus();
        }
    }, []);
    const handleMove: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (pinOne.current && pinTwo.current && pinThree.current && pinFour.current) {
            const focusedOn = event.currentTarget.id;
            if (event.keyCode === 8) { // Upon backspace
                if (focusedOn === "2" && pinTwo.current.value === "") {
                    pinOne.current.focus();
                } else if (focusedOn === "3" && pinThree.current.value === "") {
                    pinTwo.current.focus();
                } else if (focusedOn === "4" && pinFour.current.value === "") {
                    pinThree.current.focus();
                }
            } else if (focusedOn === "1" && pinOne.current.value !== "") {
                setInsertedCode(prev => prev + pinOne.current?.value.toString()); 
                pinTwo.current.focus();
            } else if (focusedOn === "2" && pinTwo.current.value !== "") {
                setInsertedCode(prev => prev + pinTwo.current?.value.toString());
                pinThree.current.focus();
            } else if (focusedOn === "3" && pinThree.current.value !== "") {
                setInsertedCode(prev => prev + pinThree.current?.value.toString() + event.key.toString());
                pinFour.current.focus();
            }
        }
    }
    useEffect(() => {
        if (requiredCodes.includes(insertedCode)) {
            proceed();
        } else if (insertedCode.length === 4 && pinOne.current && pinTwo.current && pinThree.current && pinFour.current) {
            setInsertedCode("");
            pinOne.current.value = "";
            pinTwo.current.value = "";
            pinThree.current.value = "";
            pinFour.current.value = "";
            pinOne.current.focus();
        }
    }, [insertedCode, proceed, requiredCodes]);
    return (
        <>
            <ModalBackgroundClicksPrevention handler={goBack} top={topForBackground} />
            <div className={classes.modal}>
                <p>{text}</p>
                <div className={classes.pincodeWrapper} dir="ltr">
                    <input ref={pinOne} id="1" type="password" name="pincode" inputMode="numeric" pattern="[0-9]{4}" maxLength={1} onKeyDown={handleMove} />
                    <input ref={pinTwo} id="2" type="password" name="pincode" inputMode="numeric" pattern="[0-9]{4}" maxLength={1} onKeyDown={handleMove} />
                    <input ref={pinThree} id="3" type="password" name="pincode" inputMode="numeric" pattern="[0-9]{4}" maxLength={1} onKeyDown={handleMove} />
                    <input ref={pinFour} id="4" type="password" name="pincode" inputMode="numeric" pattern="[0-9]{4}" maxLength={1} onKeyDown={handleMove} />
                </div>
            </div>
        </>
    )
};

export default CodeModal;