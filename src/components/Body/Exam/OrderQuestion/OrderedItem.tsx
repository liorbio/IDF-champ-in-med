import classes from './OrderedItem.module.css';

const OrderedItem = ({ text, itemId, currentHighest, assignedNumber, handleAssignOrder, resetOrderArrayFromHereOnward }: { text: string, itemId: number, currentHighest: number, assignedNumber: number, handleAssignOrder: (itemId: number, itemNum: number) => void, resetOrderArrayFromHereOnward: (itemId: number) => void }) => {
    const handleClick = () => {
        if (assignedNumber === 0) {
            handleAssignOrder(itemId, currentHighest+1);
        } else {
            resetOrderArrayFromHereOnward(itemId);
        }
    }
    return (
        <div className={classes.listItem} onClick={handleClick}>
            <div className={classes.orderSquare} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {assignedNumber !== 0 && <b>{assignedNumber}</b>}
            </div>
            <div className={classes.item}>{text}</div>
        </div>
    );
};

export default OrderedItem;