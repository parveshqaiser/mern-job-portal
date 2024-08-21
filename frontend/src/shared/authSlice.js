
import {createSlice} from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
    name : "authentication",
    initialState : {
        loading : false,
        userData : null,
    },
    reducers : {
        getLoadingMessage : ((initialState, action)=>{
            initialState.loading = action.payload
        }),
        storeUserData : ((initialState, action)=>{
            initialState.userData =action.payload
        })
    }
});

export const {getLoadingMessage, storeUserData} = authenticationSlice.actions;
export default authenticationSlice.reducer;