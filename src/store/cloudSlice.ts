import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from 'idb-keyval';

type PhoneState = { phoneName: string, lastUploadDate: number };
type CloudStatus = { phoneName: string, phoneList: PhoneState[], isThereAnythingToUpload: boolean };

const initialCloudStatus: CloudStatus = { phoneName: "", phoneList: [], isThereAnythingToUpload: false };

const cloudSlice = createSlice({
    name: 'cloud',
    initialState: initialCloudStatus,
    reducers: {
        reinitiateCloudStatusFromIDB(state, action) {
            return action.payload;
        },
        changePhoneName(state, action: PayloadAction<string>) {
            state.phoneName = action.payload;
            set('cloudStatus', JSON.stringify(state)).then(() => console.log('saved cloudStatus in IDB')).catch((err) => console.log(`Error in cloudStatus: ${err}`));
        },
        updatePhoneList(state, action: PayloadAction<PhoneState[]>) {
            const currentPhoneNamesOnDevice = state.phoneList.map(p => p.phoneName);
            action.payload.forEach(p => {
                if (currentPhoneNamesOnDevice.includes(p.phoneName)) {
                    state.phoneList.find(x => x.phoneName === p.phoneName)!.lastUploadDate = p.lastUploadDate;
                } else {
                    state.phoneList.push(p);
                }
            });
            set('cloudStatus', JSON.stringify(state)).then(() => console.log('saved cloudStatus in IDB')).catch((err) => console.log(`Error in cloudStatus: ${err}`));
        },
        markAnythingToUpload(state, action: PayloadAction<boolean>) {
            state.isThereAnythingToUpload = action.payload;
            set('cloudStatus', JSON.stringify(state)).then(() => console.log('saved cloudStatus in IDB')).catch((err) => console.log(`Error in cloudStatus: ${err}`));
        }
    }
});

export default cloudSlice;