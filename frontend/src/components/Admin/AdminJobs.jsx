
import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEyeSlash, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { getAuthHeaders } from '../../shared/authorization'
import axios from 'axios'
import { commonEndPoints } from '../../utils/api'
import { AlertMessage } from '../../utils/toastify'

const AdminJobs = () => {

    let navigate = useNavigate();
    const [isLoading , setIsLoading] = useState(false);
    const [tableData , setTableData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [searchText , setSearchText] = useState("");

    let {headerInfo , userDetails} = getAuthHeaders();

    useEffect(()=>{
        if(userDetails?.userId)
        {
            getAdminJobs();
        }
    },[])

    useEffect(()=>{
        if(searchText!=="")
        {
            let filter = tableData.length && tableData.filter((val)=> val?.title?.toLowerCase().includes(searchText.toLowerCase()) || val?.companyDetails?.companyName?.toLowerCase().includes(searchText.toLowerCase()));
            setFilterData(filter || []);
        }
        else {
            setFilterData(tableData);
        }
    },[searchText])

    async function getAdminJobs()
    {
        setIsLoading(true)
        try {
            let res = await axios.get(`${commonEndPoints}/getAdminJobs`,{headers:headerInfo});
            if(res?.data?.success)
            {
                setTableData(res.data?.getJobByUserId);
                setFilterData(res.data?.getJobByUserId);
            }
        } catch (error) {
            console.log("error fetching c details", error);
        }
        setIsLoading(false);        
    }

    return (
        <>
        <NavBar />
        <AlertMessage />
        <div className='max-w-6xl m-auto mt-4'>
            <div className='flex justify-between items-center'>
                <div>
                    <label className='block font-medium'>Filter Jobs</label>
                    <input 
                        type='text'
                        placeholder='Filter Jobs'
                        onChange={(e)=> setSearchText(e.target.value)}
                        className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                </div>
                <div>
                    <button 
                        onClick={()=> navigate("/admin/jobs/create")}
                        className='bg-orange-300 p-2 rounded-md hover:bg-orange-600 hover:text-white'>Add New Job
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='table mt-5 min-w-full'>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Job title</th>
                        <th>Company</th>
                        <th>Job Type</th>
                        <th>Openings</th>
                        <th>Job Location</th>
                        <th>Posted Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''> 
                {
                     isLoading ? (
                        <tr>
                            <td colSpan="8" className=' font-semibold text-center'>Loading....</td>
                        </tr>
                    ) :filterData && filterData.length ? filterData.map((val, index)=>(
                        <tr className='' key={index}>
                            <td>{index +1}</td>
                            <td><span className='text-blue-400 font-semibold'>{val?.title}</span> </td>
                            <td>{val?.companyDetails?.companyName}</td>                           
                            <td>{val.jobType}</td>
                            <td>{val?.openings}</td>
                            <td>{val.location}</td>
                            <td>{val.createdAt.split("T")[0]}</td>
                            <td className='flex space-x-2'>
                                <FontAwesomeIcon  
                                    onClick={()=> navigate(`/admin/jobs/${val?.jobId}/applicants`)}
                                    icon={faEyeSlash} 
                                    title='View Applicants'  
                                    className='cursor-pointer text-purple-500 w-6 h-6 mx-2' 
                                />
                                <FontAwesomeIcon
                                    onClick={()=> navigate(`/admin/jobs/update/${val?.jobId}`)}
                                    icon={faUserPen}
                                    className='cursor-pointer text-green-500 w-5 h-5 mx-2' 
                                    title='Edit Job' 
                                 />
                            </td>
                        </tr>    
                    )) : searchText.length ? (
                        <tr>
                            <td colSpan="8" className='text-center sm:text-center' >
                            <span className='text-red-500 font-semibold'> "{searchText}", No Job Found.</span>
                            </td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="8" className='text-center'>
                            <span className='text-red-500 font-semibold'> No Job details found. Please add a Job to see the details here.</span>
                            </td>
                        </tr>
                    )
                }              
                </tbody>
                </table>
            </div>
           
        </div>        
        </>
    )
}

export default AdminJobs;
