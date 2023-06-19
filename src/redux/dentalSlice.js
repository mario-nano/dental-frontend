import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isDentalFound: undefined,
    mapSelected: false,
    dentalId: undefined,
    name: '',
    owner: '',
    ownerId: '',
    doctors: [],
    doctorDetails: [],
    address: '',
    city: '',
    coordinate: {
        longitude: undefined,
        latitude: undefined
    },
    openinghours: {
        monday: {
            open: 0,
            close: 23
        },
        tuesday: {
            open: 0,
            close: 24
        },
        wednesday: {
            open: 0,
            close: 24
        },
        thursday: {
            open: 0,
            close: 24
        },
        friday: {
            open: 0,
            close: 24
        }
    },
    dentals: []
};

const dentalSlice = createSlice({
    name: 'dental',
    initialState,
    reducers: {
        setDentalParam: (state, action) => {
            const fieldName = action.payload.fieldName;
            state[fieldName] = action.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setDentalParam } = dentalSlice.actions

export default dentalSlice.reducer
