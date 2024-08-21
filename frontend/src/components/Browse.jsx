

import React, { useEffect, useState } from 'react'
import NavBar from "./NavBar";
import JobsList from './JobsList';
import useGetAllJobs from '../shared/useGetAllJobs';
import { useDispatch, useSelector } from 'react-redux';
import { storeSearchQuery } from '../shared/jobsSlice';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders } from '../shared/authorization';
import { AlertMessage } from '../utils/toastify';


const Browse = () => {

    let dispatch = useDispatch();
    let {userDetails} = getAuthHeaders();

    useGetAllJobs();
    let jobs = useSelector(store => store?.job?.allJobs);
    let query = useSelector(store=> store?.job?.searchQuery);
    let navigate = useNavigate();

    const [myQuery , setMyQuery] = useState(query);

    useEffect(()=>{
        if(!userDetails || userDetails.userId == null)
        {
            navigate("/login")
        }else if(userDetails?.role == "Recruiter")
        {
            navigate("/admin/companies");
        }
    },[])

    useEffect(()=>{
       return()=>{
        dispatch(storeSearchQuery(""));
       }
    },[])
   
    return (
    <>
        <NavBar />
        <AlertMessage />
        <div className='max-w-7xl mx-auto mt-10 '>
            <h1 className='text-xl font-semibold'>Search Results [{jobs && jobs.length}]</h1>
            <p className='text-black underline cursor-pointer' onClick={()=> navigate("/home")}> Go Back</p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-4'>
            {
                jobs && jobs.length ? jobs.map((val) => <JobsList val={val} key={val?._id} />) 
                : myQuery.length ?(
                    <div className='text-center text-red-500 text-lg'>" {myQuery} ", No Such Jobs Found</div>
                ) 
                :(
                <div className='bg-red-200 text-center'>No Jobs Available</div>
            )
            }
            </div>
        </div>
    </>
    )
}

export default Browse;
