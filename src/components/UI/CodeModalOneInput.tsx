import ModalBackgroundClicksPrevention from "./ModalBackgroundClicksPrevention";
import classes from './CodeModal.module.css';
import { useState, ChangeEventHandler } from "react";

const CodeModalOneInput = ({ text, requiredCodes, proceed, goBack, topForBackground }: { text: string, requiredCodes: string[], proceed: () => void, goBack: () => void, topForBackground: number }) => {
    const [insertedCode, setInsertedCode] = useState("");

    const handleType: ChangeEventHandler<HTMLInputElement> = (event) => {
        setInsertedCode(event.currentTarget.value);
        if (requiredCodes.includes(event.currentTarget.value)) {
            proceed();
            setInsertedCode("");
        }
    }

    return (
        <>
            <ModalBackgroundClicksPrevention handler={goBack} top={topForBackground} />
            <div className={classes.modal}>
                <p>{text}</p>
                <div className={classes.pincodeWrapper} dir="ltr">
                    <input id="pin" type="password" name="pincode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} onChange={handleType} value={insertedCode} />
                </div>
            </div>
        </>
    )
};

export default CodeModalOneInput;