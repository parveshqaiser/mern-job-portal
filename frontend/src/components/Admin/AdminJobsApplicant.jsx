import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { commonEndPoints } from '../../utils/api';
import { getAuthHeadersOfApplicationJson } from '../../shared/authorization';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { AlertMessage } from '../../utils/toastify';

const AdminJobsApplicant = () => {

    let {id} = useParams();
    let navigate = useNavigate();

    const [tableData , setTableData] = useState([]);
    const [isLoading , setIsLoading] = useState(false);
    const [callFunction , setCallFunction] = useState(false);

    let headerInfo = getAuthHeadersOfApplicationJson();

    useEffect(()=>{
        getApplicantDetails()
    },[])

    async function getApplicantDetails()
    {
        try {
            setIsLoading(true);
            let res = await axios.get(`${commonEndPoints}/getApplicants/${id}`, {headers : headerInfo})
            if(res?.data?.success)
            {
                setTableData(res?.data?.findApplicants || []);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error loading data", error);
            setIsLoading(false);

        }
    }

    async function handleSubmitStatus(status , id)
    {
        let data = {
            status : status,
            jobId : tableData[0]?._id?.jobId,
        };
        console.log(data);

        try {
            let res = await axios.post(`${commonEndPoints}/updateApplicationStatus/${id}`, data, {headers : headerInfo});
            // setCallFunction(true)
            if(res.data.success)
            {
                toast.success(res?.data?.message);
            }
        } catch (error) {
            console.log("err ", error);
            toast.error(error.response?.data?.message);
            // setCallFunction(false)
        }
    }
    
    return (
        <>
        <NavBar />
        <AlertMessage />
        <div className='max-w-7xl mx-auto mt-5 p-2 rounded-md'>
            <div>
                <button onClick={() => navigate("/admin/jobs")} className='bg-[#2d2d2d] text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none'>
                    Go Back
                </button>
            </div>
            <h1 className='text-center font-bold my-2'>Job Info</h1>
            <hr className='w-full mx-auto' />
            <div className='flex justify-around my-2'>
            {
                tableData && tableData.length >0 && (
                <>
                    <span className='font-semibold'>Company : {tableData[0]?._id?.companyName || ""}</span>
                    <span className='font-semibold'>Title: {tableData[0]?._id?.title || ""}</span>
                    <span className='font-semibold'>Openings: {tableData[0]?._id?.openings || ""}</span>
                    <span className='font-semibold'>Applicants: <span className='text-red-600 font-bold'>[{tableData[0]?.userDetails?.length || 0}]</span></span>
                </>
                )
            }                
            </div>
            <div className='overflow-x-auto'>
                <table className='table-auto w-full my-4 border-collapse'>
                    <thead>
                        <tr className='bg-gray-300'>
                            <th className='p-2 border border-gray-400'>S.No</th>
                            <th className='p-2 border border-gray-400'>Applicant</th>
                            <th className='p-2 border border-gray-400'>Contact No</th>
                            <th className='p-2 border border-gray-400'>Email</th>
                            <th className='p-2 border border-gray-400'>Resume</th>
                            <th className='p-2 border border-gray-400'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className='font-semibold text-center p-4'>Loading....</td>
                            </tr>
                        ) : tableData && tableData.length ? tableData[0].userDetails?.map((val, index) => (
                            <tr key={index}>
                                <td className='p-2 border border-gray-400'>{index + 1}</td>
                                <td className='p-2 border border-gray-400'>{val?.fullName}</td>
                                <td className='p-2 border border-gray-400'>{val?.mobile}</td>
                                <td className='p-2 border border-gray-400'>{val?.email}</td>
                                <td className='p-2 border border-gray-400'>
                                    <a 
                                        target= "_blank"
                                        download 
                                        className={`${val?.profile?.resumeName ? "text-blue-500 underline" : ""}`}
                                        href={val?.profile?.resumeLink}
                                    >
                                        {val?.profile?.resumeName || "Not Uploaded"}
                                    </a>
                                </td>
                                <td className='p-2 border border-gray-400'>
                                {
                                    val?.status =="Pending" ? 
                                    <>
                                    <FontAwesomeIcon 
                                        className='cursor-pointer w-6 h-6 mr-2 text-green-500'
                                        icon={faThumbsUp} 
                                        title='Approve'
                                        onClick={()=>handleSubmitStatus("Accepted",`${val?.userId}`,)}
                                    />
                                    <FontAwesomeIcon 
                                        className='cursor-pointer w-6 h-6 ml-2 text-red-700'
                                        icon={faXmark} 
                                        title='Reject'
                                        onClick={()=>handleSubmitStatus("Rejected" ,`${val?.userId}`)}
                                    />
                                    </> : <span>{val.status}</span>
                                } 
                                    
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className='text-center p-4'>
                                    <span className='text-red-500 font-semibold'>No Applicants Found.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default AdminJobsApplicant;