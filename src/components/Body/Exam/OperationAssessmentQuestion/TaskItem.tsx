import { assess } from "./OperationAssessmentQuestion";
import classes from './TaskItem.module.css';

const TaskItem = ({ text, taskId, status, handleCorrectWrong }: { text: string, taskId: number, status: assess, handleCorrectWrong: (taskId: number, correctWrong: assess) => void }) => {
    //const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

    const handleV = () => {
        handleCorrectWrong(taskId, "correct");
    };
    const handleX = () => {
        handleCorrectWrong(taskId, "wrong");
    }
    return (
        <div className={classes.taskWrapper}>
            <div onClick={handleV} className={`${classes.circle} ${status === 'correct' && classes.correct}`}><span style={{ color: "white", fontSize: "1.4rem" }}>&#x2713;&#xFE0E;</span></div>
            <div onClick={handleX} className={`${classes.circle} ${status === 'wrong' && classes.wrong}`}><span style={{ color: "white", fontSize: "1.4rem" }}>&#x2A2F;&#xFE0E;</span></div>
            <div className={`${classes.itemText} ${status === 'correct' && classes.correctText} ${status === 'wrong' && classes.wrongText}`} style={{ textAlign: "right", paddingRight: "0.5rem" }}>{text}</div>
        </div>
    );
};

export default TaskItem;