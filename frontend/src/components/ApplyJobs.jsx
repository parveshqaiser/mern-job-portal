
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from './NavBar';
import useGetJobById from '../shared/useGetJobById';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import getPostedDays from '../utils/dayConverter';
import axios from 'axios';
import { commonEndPoints } from '../utils/api';
import { getAuthHeaders } from '../shared/authorization';
import { toast } from 'react-toastify';
import { AlertMessage } from '../utils/toastify';
import useGetApplications from '../shared/useGetApplications';
import useGetUserData from '../shared/useGetUserData';

const ApplyJobs = () => {

    let {id} = useParams();
    let isLoading = useGetJobById(id) // hook
    let {userDetails , headerInfo}= getAuthHeaders();
    useGetApplications();
    useGetUserData();

    let job = useSelector(store => store?.job?.singleJob);
    let application = useSelector(store => store?.application?.allApplication);
    let user = useSelector(store => store?.auth?.userData)

    let navigate = useNavigate();

    let isAlreadyApplied = application && application.length && application.some(val => val?.job == job?.jobId) || false;
    const [isApplied, setIsApplied] = useState(isAlreadyApplied);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    async function handleApplyJob()
    {
        let data = {
            jobId : id,
            userId : userDetails.userId
        }

        if(user?.profile && user?.profile?.profilePicture =="")
        {
            toast.warning("Please Update Your Profile to Apply for Jobs");
            return;
        }

        try {
            let res = await axios.post(`${commonEndPoints}/applyJobs/${id}`, data , {headers : headerInfo});
            if(res.data.success)
            {
                toast.success(res.data.message);
                setTimeout(()=>{
                    navigate("/jobs");
                },2400)
            }
        } catch (error) {
            console.log("err ", error);
            toast.error(error.response?.data?.message);
        }
    }

    return (
        <>
        <NavBar />
        <AlertMessage />
        {
            isLoading ? <div className='font-semibold text-center'>Loading...</div> : 
            <>
            <div className='p-4 max-w-6xl mx-auto shadow-md rounded-lg mt-5 bg-gray-50 border border-gray-200'>
                <p className='text-black underline cursor-pointer inline-block' onClick={()=> navigate("/jobs")}> Go Back</p>

                <div className='flex flex-col md:flex-row items-center justify-between mb-2'>
                    <div>
                        <h1 className='font-semibold text-2xl text-gray-800'>{job?.title}</h1>
                        <div className='flex md:items-center text-md text-gray-500 mt-1'>
                            <span>{job?.companyDetails?.companyName || "NA"}</span>                      
                        </div>
                    </div>
                    <img src={job?.companyDetails?.logo} alt="company logo" className='w-20 md:w-28 object-cover rounded-md' />
                </div>

                <div className='grid  grid-cols-1 md:grid-cols-3 gap-4 text-md text-gray-600 mt-2'>
                    <div className='flex items-center  md:justify-start'>
                        <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                        <span className='ml-1'>{job?.location || "Not Provided"}</span>
                    </div>
                    <div className='flex items-center  md:justify-start'>
                        <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                        <span className='ml-1'>{job?.workExperience || "NA"} years</span>
                    </div>
                    <div className='flex items-center  md:justify-start'>
                        <span className='ml-1'> <span className='text-xl font-semibold'>₹ </span> {job?.salary || "Not Disclosed"} LPA</span>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-between mt-2'>
                    <div className='text-center md:text-left mb-4 md:mb-0'>
                        <span className=''>Posted : {getPostedDays(job?.createdAt)}</span>
                        <span className='mx-3'>Openings : {job?.openings}</span>
                        <span className='mx-3'>Applicants : <span className='text-yellow-600'>{job?.application?.length || "0"}</span></span>
                    </div>   
                    {
                        job?.isJobExpired ===  "true" ? (
                            <span className='py-2 px-4 text-red-400 font-semibold'>Application for this Job is Closed</span>
                        ) : (
                            isAlreadyApplied ? (
                                <button 
                                    disabled={isAlreadyApplied} 
                                    className='bg-blue-300 text-white cursor-not-allowed py-2 px-4 rounded-md'>
                                    Already Applied
                                </button>
                            ) : (
                                <button 
                                    onClick={handleApplyJob}
                                    className='bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md'>
                                    Apply
                                </button>
                            )
                        )
                    }                              
                </div>
            </div>
        
            <div className='p-3 max-w-6xl mx-auto shadow-lg rounded-lg mt-2 bg-white border border-gray-200'>
                <h1 className='text-xl font-semibold text-gray-800 mb-3'>Job Description</h1>
                <p className='text-gray-600 mb-6'>{job?.description || "NA"}</p>
                
                <h1 className='text-lg font-medium text-gray-800 mb-3'>Must Have Skills</h1>
                <ul className='list-disc list-inside text-gray-600 mb-2'>
                    {job?.requirements?.map((val, index) => (
                        <li key={index} className='ml-4'>{val}</li>
                    )) || "NA"}
                </ul>
        
                <h1 className='text-lg font-medium text-gray-800 mb-2'>Education</h1>
                <p className='text-gray-600 mb-3'>{job?.qualification || "NA"}</p>
                
                <h1 className='text-lg font-medium text-gray-800 mb-2'>More About Company</h1>
                <p className='text-gray-600 mb-1'>Organization : {job?.companyDetails?.companyName || "NA"}</p>
                <p className='text-gray-600 mb-1'>About : {job?.companyDetails?.description || "NA"}</p>
                <p className='text-gray-600 mb-1'>Head Office : {job?.companyDetails?.location || "NA"}</p>
                <p className='text-gray-600'>Visit us @ : <a className='hover:underline'>{job?.companyDetails?.website || "NA"}</a></p>
            </div>

            <div className='p-3 max-w-6xl mx-auto shadow-lg rounded-lg my-2 bg-white border border-gray-200'>
                <h1 className='text-lg font-medium text-red-500 mb-3'>Beware of Imposters</h1>
                <blockquote className='text-gray-600'>Monster.com does not promise a job or an interview in exchange of money. 
                Fraudsters may ask you to pay in the pretext of registration fee, Refundable Fee or share any OTP number. 
                Please don't fall for such prey. We at <span className='font-bold'>Monster.com</span>  never ask for any payments.
                <br/>
                    However in the wake of increasing number of instances of fake job offers, we suggest you to be cautious of fraud calls and emails.
                </blockquote>
            </div>
        </>
        }
        </>
    )
}

export default ApplyJobs;
