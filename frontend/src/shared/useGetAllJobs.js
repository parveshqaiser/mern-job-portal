import { useDispatch, useSelector } from "react-redux";
import { getAuthHeaders } from "./authorization";
import { useEffect, useState } from "react";
import axios from "axios";
import { commonEndPoints } from "../utils/api";
import { storeAllJobs } from "./jobsSlice";

const useGetAllJobs = () => {
  
    let {headerInfo, userDetails} = getAuthHeaders();
    let dispatch = useDispatch();

    let query = useSelector(store => store?.job?.searchQuery);
    const [loading , setLoading] = useState(false);

    useEffect(()=>{
        if(userDetails?.userId)
        {
            getAllJobs()
        }        
    },[]);

    async function getAllJobs()
    {
        setLoading(true)
        try {
            let res = await axios.get(`${commonEndPoints}/getAllJobs?keyword=${query}`,{headers : headerInfo});
        
            if(res.data && res.data.allJobs)
            {
                dispatch(storeAllJobs(res.data.allJobs))
            }
        } catch (error) {
            console.log("error loading all jobs ", error);
        }
        setLoading(false)        
    }

    return {loading}
}

export default useGetAllJobs;



   
