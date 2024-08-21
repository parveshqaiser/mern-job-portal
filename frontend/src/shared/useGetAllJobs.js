import { useDispatch, useSelector } from "react-redux";
import { getAuthHeaders } from "./authorization";
import { useEffect } from "react";
import axios from "axios";
import { commonEndPoints } from "../utils/api";
import { storeAllJobs } from "./jobsSlice";

const useGetAllJobs = () => {
  
    let {headerInfo, userDetails} = getAuthHeaders();
    let dispatch = useDispatch();

    let query = useSelector(store => store?.job?.searchQuery)

    useEffect(()=>{
        getAllJobs()
    },[]);

    async function getAllJobs()
    {
        if(userDetails?.userId)
        {
            try {
                let res = await axios.get(`${commonEndPoints}/getAllJobs?keyword=${query}`,{headers : headerInfo});
            
                if(res.data && res.data.allJobs)
                {
                    dispatch(storeAllJobs(res.data.allJobs))
                }
            } catch (error) {
                console.log("error loading all jobs ", error);
            }
        }
    }
}

export default useGetAllJobs;



   
