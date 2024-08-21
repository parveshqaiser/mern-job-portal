
import { createSlice } from "@reduxjs/toolkit";


const companySlice = createSlice({
    name : "company",
    initialState : {
        allCompanies : [],
    },
    reducers : {
        storeAllCompanies : ((initialState, action)=>{
            initialState.allCompanies = action.payload
        })
    }
});

export const {storeAllCompanies} = companySlice.actions;
export default companySlice.reducer;