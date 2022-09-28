import classes from './ModalBackgroundClicksPrevention.module.css';

const ModalBackgroundClicksPrevention = ({ handler, top }: { handler: () => void, top: number }) => {
    return (
        <div className={classes.prevention} onClick={handler} style={{ top: `${top}vh`, height: `${100-top}vh` }}></div>
    )
};

export default ModalBackgroundClicksPrevention;