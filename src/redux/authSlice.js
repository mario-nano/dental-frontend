import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLogged: false,
    userId: undefined,
    username: undefined,
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    roles: [],
    status: undefined,
    patientDetails: undefined,
    doctorDetails: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogged: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isLogged = action.payload;
        },
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setAuthParam: (state, action) => {
            const fieldName = action.payload.fieldName;
            state[fieldName] = action.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setLogged, setUserName, setStatus, setAuthParam } = authSlice.actions

export default authSlice.reducer
