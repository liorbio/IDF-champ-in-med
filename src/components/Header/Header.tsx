import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import HeaderInHome from './HeaderInHome';
import HeaderInExam from './HeaderInExam';
import HeaderTimesUp from './HeaderTimesUp';
import HeaderInAddUnits from './HeaderInAddUnits';
import HeaderInStationSetup from './HeaderInStationSetup';
import HeaderInRoundSetup from './HeaderInRoundSetup';
import HeaderInLeaderboard from './HeaderInLeaderboard';
import HeaderInCloudStatus from './HeaderInCloudStatus';
import RequireAuth from '../Auth/RequireAuth';

const Header = () => {
    const navigate = useNavigate();
    const house = useAppSelector(state => state.current.house);
    const unit = useAppSelector(state => state.current.unit);
    const player = useAppSelector(state => state.current.player);

    return (
        <Routes>
            <Route path="/" element={<HeaderInHome />} />
            <Route path="/exam" element={<RequireAuth levels={["rep", "boss", "chief"]}><HeaderInExam house={house} unit={unit} player={player} navigate={navigate} /></RequireAuth>} />
            <Route path="/timesup" element={<RequireAuth levels={["rep", "boss", "chief"]}><HeaderTimesUp house={house} unit={unit} player={player} /></RequireAuth>} />
            <Route path="/add-units" element={<RequireAuth levels={["chief"]}><HeaderInAddUnits navigate={navigate} /></RequireAuth>} />
            <Route path="/station-setup" element={<RequireAuth levels={["boss","chief"]}><HeaderInStationSetup navigate={navigate} /></RequireAuth>} />
            <Route path="/round-setup" element={<RequireAuth levels={["rep", "boss", "chief"]}><HeaderInRoundSetup house={house} unit={unit} navigate={navigate} /></RequireAuth>} />
            <Route path="/leaderboard" element={<RequireAuth levels={["chief"]}><HeaderInLeaderboard /></RequireAuth>} />
            <Route path="/cloud-status" element={<RequireAuth levels={["boss","chief"]}><HeaderInCloudStatus navigate={navigate} /></RequireAuth>} />
        </Routes>
    );
};

export default Header;