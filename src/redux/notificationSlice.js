import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toastCount: 0,
    newAppointment: 0,
    toastType: undefined,
    toastMessage: undefined,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        incrementCount: (state, action) => {
            state.toastCount++;
        },
        incrementNewAppointment: (state, action) => {
            state.newAppointment++;
        },
        setNotificationParam: (state, action) => {
            const fieldName = action.payload.fieldName;
            state[fieldName] = action.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setNotificationParam, incrementCount, incrementNewAppointment } = notificationSlice.actions

export default notificationSlice.reducer
