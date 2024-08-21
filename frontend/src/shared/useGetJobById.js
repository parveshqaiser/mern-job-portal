import axios from "axios";
import { useEffect, useState } from "react"
import { commonEndPoints } from "../utils/api";
import { useDispatch } from "react-redux";
import { getAuthHeaders } from "./authorization";
import { storeSingleJob } from "./jobsSlice";

const useGetJobById = (id) => {
  
    let {headerInfo} = getAuthHeaders();

    let dispatch = useDispatch();

    const [isLoading , setIsLoading] = useState(true)

    useEffect(()=>{
        getJob();
    },[])
    
    async function getJob()
    {
        setIsLoading(true)
        try {            
            let res = await axios.get(`${commonEndPoints}/getJobById/${id}`, {headers :headerInfo });
            // console.log("res ", res);       
            if(res.data?.success)
            {
                dispatch(storeSingleJob(res?.data?.getJob[0]));
            }
        } catch (error) {
            console.log("error getting job", error);
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    return isLoading;
}

export default useGetJobById;
