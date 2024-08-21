
import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "./authSlice";
import jobsSlice from "./jobsSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";


const reduxStore = configureStore({
    reducer : {
        auth : authenticationSlice,
        job : jobsSlice,
        company : companySlice,
        application : applicationSlice
    }
});

export default reduxStore;