import classes from './UIButton.module.css';

const UIButton = ({ label, active, handler, top }: { label: string, active: boolean, handler: () => void, top?: string }) => {
    const handleClick = () => {
        if (active) {
            handler();
        } else {
            return;
        }
    }
    return (
        <button className={`${classes.uiButton} ${active && classes.active}`} onClick={handleClick} style={{ top: top }}>{label}</button>
    )
};

export default UIButton;