import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AddUnits from './components/Body/AddUnits/AddUnits';
import WholeExam from './components/Body/Exam/WholeExam';
import Home from './components/Body/Home/Home';
import Leaderboard from './components/Body/Leaderboard/Leaderboard';
import SetupRound from './components/Body/SetupRound/SetupRound';
import SetupStation from './components/Body/SetupStation/SetupStation';
import TimesUp from './components/Body/TimesUp/TimesUp';
import Header from './components/Header/Header';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { cloudActions, deviceScoresActions, housesActions, scoreBoardActions, unitsActions } from './store/redux-logic';
import CloudStatus from './components/Body/CloudStatus/CloudStatus';
import RequireAuth from './components/Auth/RequireAuth';
import { get } from 'idb-keyval';


const MIRPAA_UNITS: string[] = ['יחידה 1','יחידה 2','יחידה 3','יחידה 4','יחידה 5'];
const TANATZ_UNITS: string[] = ['יחידה 6','יחידה 7','יחידה 8','יחידה 9','יחידה 10'];
const SPECIAL_UNITS: string[] = ['יחידה 11','יחידה 12','1יחידה 3','1יחידה 4','1יחידה 5'];
const HATAM_UNITS: string[] = ['יחידה 16','יחידה 17','יחידה 18','יחידה 19','יחידה 20'];
const housesList = ["מרפאה", "טנ\"צ", "מיוחדות", "חת\"ם והגנת גבולות"];

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(housesActions.setHouses(housesList));
    dispatch(unitsActions.initializeUnits({ house: housesList[0], units: MIRPAA_UNITS}));
    dispatch(unitsActions.initializeUnits({ house: housesList[1], units: TANATZ_UNITS}));
    dispatch(unitsActions.initializeUnits({ house: housesList[2], units: SPECIAL_UNITS}));
    dispatch(unitsActions.initializeUnits({ house: housesList[3], units: HATAM_UNITS}));
    get('deviceScores').then((val) => {
      if (val) dispatch(deviceScoresActions.reinitiateDeviceScoresFromIDB(JSON.parse(val)));
    });
    get('housesDevices').then((val) => {
      if (val) dispatch(housesActions.reinitiateDevicesForHousesFromIDB(val));
    });
    get('cloudStatus').then((val) => {
      if (val) dispatch(cloudActions.reinitiateCloudStatusFromIDB(JSON.parse(val)));
    })
  }, [dispatch]);
  const unitsPerHouse = useAppSelector(state => state.units.unitsPerHouse); 
  useEffect(() => {
    if (Object.keys(unitsPerHouse).length > 0) {
      const fixedUnitsPerHouse: Record<string, string[]> = {};
      for (const house in unitsPerHouse) {
        fixedUnitsPerHouse[house] = unitsPerHouse[house].units;
      }
      get('scoreBoard').then((val) => { 
        if (!val) {
          dispatch(scoreBoardActions.initiateScoreBoard({ unitsPerHouse: fixedUnitsPerHouse }))
        } else {
          dispatch(scoreBoardActions.reinitiateScoreBoardFromIDB(JSON.parse(val)));
        }
      }); 
    }
  }, [dispatch, unitsPerHouse]);

  return (
    <div className="App">
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-units" element={<RequireAuth levels={["chief"]}><AddUnits unitsPerHouse={unitsPerHouse} /></RequireAuth>} />
          <Route path="/station-setup" element={<RequireAuth levels={["boss", "chief"]}><SetupStation /></RequireAuth>} />
          <Route path="/round-setup" element={<RequireAuth levels={["rep", "boss", "chief"]}><SetupRound /></RequireAuth>} />
          <Route path="/exam" element={<RequireAuth levels={["rep", "boss", "chief"]}><WholeExam /></RequireAuth>} />
          <Route path="/timesup" element={<RequireAuth levels={["rep", "boss", "chief"]}><TimesUp /></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth levels={["chief"]}><Leaderboard /></RequireAuth>} />
          <Route path="/cloud-status" element={<RequireAuth levels={["boss", "chief"]}><CloudStatus /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
