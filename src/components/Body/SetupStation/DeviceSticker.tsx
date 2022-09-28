import classes from './DeviceSticker.module.css';

const DeviceSticker = ({ device, highlighted, handleClick }: { device: string, highlighted: boolean, handleClick: (device: string) => void }) => {
    const handler = () => {
        handleClick(device);
    };
    
    return (
        <div className={`${classes.sticker} ${highlighted && classes.highlightedSticker}`} onClick={handler}>{device}</div>
    )
};

export default DeviceSticker;