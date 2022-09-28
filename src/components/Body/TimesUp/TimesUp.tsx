import { useNavigate } from "react-router-dom";
import UIButton from "../../UI/UIButton";

const TimesUp = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/round-setup');
    };
    return (
        <div style={{ width: "100vw", height: "85vh" }}>
            <h1 style={{ marginTop: 0, paddingTop: "15vh" }}>נגמר הזמן!</h1>
            <UIButton label="לשחקן הבא" active={true} handler={handleClick} />
        </div>
    );
};

export default TimesUp;