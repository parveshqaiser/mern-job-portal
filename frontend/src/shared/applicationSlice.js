
import { createSlice } from "@reduxjs/toolkit";


const applicationSlice = createSlice({
    name : "application",
    initialState : {
        allApplication : [],
    },
    reducers : {
        storeAllApplication : ((initialState, action)=>{
            initialState.allApplication = action.payload
        })
    }
});

export const {storeAllApplication} = applicationSlice.actions;
export default applicationSlice.reducer;