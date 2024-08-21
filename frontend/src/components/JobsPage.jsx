import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import JobsFilter from './JobsFilter'
import JobsList from './JobsList';
import useGetAllJobs from '../shared/useGetAllJobs';
import { useSelector } from 'react-redux';
import useGetApplications from '../shared/useGetApplications';
import { getAuthHeaders } from '../shared/authorization';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../utils/toastify';

// This is starting point of jobs
const JobsPage = () => {
    
    let data  = ["1", "2" , "3", "4", "5", "6"];
    useGetAllJobs();
    useGetApplications();

    let jobs = useSelector(store => store?.job?.allJobs);
    let query = useSelector(store => store?.job?.searchQuery);

    const [jobList , setJobList] = useState(jobs);
    let {userDetails} = getAuthHeaders();
    let navigate = useNavigate();

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
        if(query.length)
        {
            let filter = jobs && jobs.length && jobs.filter((val)=>{
                return val?.title?.toLowerCase().includes(query.toLowerCase()) ||
                val?.location?.toLowerCase().includes(query.toLowerCase()) || 
                String(val?.salary).includes(query.trim())
            });

            setJobList(filter);
        }else {
            setJobList(jobs);
        }
    },[query, jobs])

    return (
        <>
        <NavBar />
        <AlertMessage />
        <div className=' max-w-7xl mx-auto mt-5'>
            <div className='flex flex-col md:flex-row'>
                <div className='md:w-1/5 h-screen overflow-hidden overflow-y-auto'>
                    <h1 className='font-bold my-1'>Filter Options</h1>
                    <JobsFilter />
                </div>
                
                <div className='w-full md:w-3/4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                    {
                        jobList && jobList.length ? 
                        (jobList?.map((val) => <JobsList val={val} key={val?._id}/>)) : 
                        (<div className='text-center ml-10'>Not Jobs Available</div>)
                    }
                    </div>
                </div>
            </div>               
        </div>
        </>
    )
}

export default JobsPage
