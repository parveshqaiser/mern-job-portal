
import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name : "job",
    initialState : {
        allJobs : [],
        singleJob : null, // id
        searchQuery : "", 
    },
    reducers : {
        storeAllJobs : ((initialState, action)=>{
            initialState.allJobs = action.payload
        }),
        storeSingleJob : ((initialState, action)=>{
            initialState.singleJob = action.payload
        }),
        storeSearchQuery :((initialState, action)=>{
            initialState.searchQuery = (action.payload)
        }),
        // clearSearchQuery :((initialState, action)=>{
        //     initialState.searchQuery =[]
        // }),
    }
});

export const {storeAllJobs , storeSingleJob , storeSearchQuery} = jobSlice.actions;
export default jobSlice.reducer;