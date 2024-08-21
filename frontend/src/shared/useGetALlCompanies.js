
import React , { useEffect, useState } from "react"; 
import { getAuthHeaders } from "./authorization";
import { commonEndPoints } from "../utils/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { storeAllCompanies } from "./companySlice";

// custom hook to get all companies
const useGetAllCompanies = () => {

    let {headerInfo , userDetails} = getAuthHeaders();
    let dispatch =useDispatch();

    const [tableData , setTableData] = useState([]);
    const [isLoading , setIsLoading] = useState(false);

    useEffect(()=>{
        if(userDetails?.userId)
        {
            getCompanyDetails();
        }      
    },[])

    async function getCompanyDetails()
    {
        setIsLoading(true)
        try {
            let res = await axios.get(`${commonEndPoints}/getAllCompanyDetails`,{headers:headerInfo});
            if(res?.data?.success)
            {
                setTableData(res.data.getAllData || [])
                dispatch(storeAllCompanies(res.data.getAllData))
                setIsLoading(false)
            }
        } catch (error) {
            console.log("error fetching company details", error);
            setTableData([]);
        }
        setIsLoading(false)        
    }
    return {isLoading , tableData}
}

export default useGetAllCompanies;
