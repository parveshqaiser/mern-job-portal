import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { commonEndPoints } from '../utils/api';
import { getAuthHeadersOfApplicationJson } from './authorization';
import { useDispatch } from "react-redux";
import { storeAllApplication } from './applicationSlice';


// custom hook to get all jobs applied by student
const useGetApplications = () => {
  
    let headerInfo = getAuthHeadersOfApplicationJson();

    let dispatch = useDispatch();
    let [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        getApplication()
    },[]);

    async function getApplication()
    { 
        setIsLoading(true)
        try {
            let res = await axios.get(`${commonEndPoints}/allJobsAppliedByStudent`, {headers : headerInfo});

            if(res.data.success)
            {
                dispatch(storeAllApplication(res?.data?.getAllApplications));
                setIsLoading(false)
            }
        } catch (error) {
            console.log("error loading data ", error);
            setIsLoading(false)
        }
        setIsLoading(false)
    }
    return {isLoading};
}

export default useGetApplications
