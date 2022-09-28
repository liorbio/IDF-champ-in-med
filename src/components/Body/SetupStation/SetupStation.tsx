import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { authActions, housesActions } from "../../../store/redux-logic";
import { QuestionData } from "../../../types/question-types";
import DevicesForStation from "./DevicesForStation";
import SetupStationFooter from "./SetupStationFooter";

type QuestionBank = { device: string, questions: QuestionData[] };

// House list (in the future - AFTER CHAMPIONSHIP) should be gotten in the following way:
// Upon very first launch of app - ServiceWorker gets houses from Mongo and puts in local storage
// Upon every loading of App - get houses from local storage to Redux



const SetupStation = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const houses = useAppSelector(state => state.houses.houses);
    const [devicesPerHouse, setDevicesPerHouse] = useState<Record<string, string[]>>({});
    const [devices, setDevices] = useState<string[]>([]);

    // useEffect: get devices (from public JSON) and houses (from Mongo (in the future)) and put houses in Redux + IN SETSTATE
    useEffect(() => {
        const populateDevicesArray = async () => {
            const resp = await fetch('/questionBank.JSON');
            const data: QuestionBank[] = await resp.json();
            const devArray = data.map(d => d.device);
            setDevices(devArray);
        };
        try {
            populateDevicesArray();
            // houses (fetched in App.tsx) should be gotten from Mongo:
            const initialDevicesPerHouseObj: Record<string, string[]> = {};
            for (const house of Object.keys(houses)) {
                initialDevicesPerHouseObj[house] = [];
            }
            setDevicesPerHouse(initialDevicesPerHouseObj);
            // ^ houses (fetched in App.tsx) should be gotten from Mongo
        } catch (error) {
            console.log(error);
        }
    }, [dispatch, houses]);

    const handleSaveChoices = (house: string, devices: string[], isLast: boolean) => {
        if (!isLast) {
            setDevicesPerHouse(prev => {
                const newObj = {...prev};
                newObj[house] = devices;
                return newObj;
            });
        } else {
            const devicesToSendToRedux = {...devicesPerHouse};
            devicesToSendToRedux[house] = devices;
            dispatch(housesActions.setDevicesForHouses(devicesToSendToRedux));
            dispatch(authActions.authorize("rep"));
            navigate('/round-setup');
        }
    };

    return (
        <div>
            <div style={{ overflowY: "scroll", height: "60vh" }}>
                <p>המכשירים שייבחנו בתחנה זו עבור</p>
                {Object.keys(houses).map((h, idx) => <DevicesForStation key={h} house={h} devices={devices} handleSaveChoices={handleSaveChoices} isLast={idx === Object.keys(houses).length-1} />)}
            </div>
            <SetupStationFooter devicesPerHouse={devicesPerHouse} />
        </div>
    );
};

export default SetupStation;