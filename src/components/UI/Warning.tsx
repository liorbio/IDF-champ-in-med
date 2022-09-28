import ModalBackgroundClicksPrevention from './ModalBackgroundClicksPrevention';
import classes from './TwoButtonModal.module.css';

const Warning = ({ text, handleClose }: { text: string, handleClose: () => void }) => {
    return (
        <>
            <div className={classes.modalWrapper} style={{ justifyContent: "center", height: "12vh", width: "80vw", left: "10vw", zIndex: 5 }}>
                <p>{text}</p>
            </div>
            <ModalBackgroundClicksPrevention handler={handleClose} top={0} />
        </>
    )

};

export default Warning;