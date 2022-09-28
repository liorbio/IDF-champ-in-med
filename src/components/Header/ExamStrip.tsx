import classes from './ExamStrip.module.css';

// numberOfQuestions --> from local storage (after downloading from Mongo) (as a function of device name -- from Redux currentDevice)
// currentQuestion --> straight from Redux state
// questionsSolved --> derived from Redux state

//Example:
// 15
// 4
// [1, 13]

const ExamStrip = ({ numberOfQuestions, currentQuestion, questionsSolved }: { numberOfQuestions: number, currentQuestion: number, questionsSolved: number[] }) => {
    const questionSquare = (status: "solved" | "unsolved" | "current", key: number) => {
        return (
            <div key={key} className={`${classes.questionSquare} ${classes[status]}`}></div>
        )
    };
    
    return (
        <div className={classes.stripWrapper} style={{ gridTemplateColumns: `repeat(${numberOfQuestions}, 1fr)` }}>
            {[...Array(numberOfQuestions)].map((e, i) => {
                if (i+1 === currentQuestion) {
                    return questionSquare("current", i);
                } else if (questionsSolved.includes(i+1)) {
                    return questionSquare("solved", i);
                } else {
                    return questionSquare("unsolved", i);
                }
            })}
        </div>
    )
};

export default ExamStrip;