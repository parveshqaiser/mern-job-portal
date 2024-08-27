

import React, { useState } from 'react'
import NavBar from '../NavBar'
import { useNavigate } from 'react-router-dom';
import { getAuthHeadersOfApplicationJson } from '../../shared/authorization';
import { useSelector } from 'react-redux';
import { removeDomElementsFromInput } from '../../utils/domSanitize';
import axios from 'axios';
import { commonEndPoints } from '../../utils/api';
import { toast } from 'react-toastify';
import { AlertMessage } from '../../utils/toastify';
import useGetAllCompanies from '../../shared/useGetALlCompanies';

const CreateJobs = () => {

    useGetAllCompanies();
    let companiesList = useSelector(store => store?.company?.allCompanies);

    // console.log("companiesList", companiesList)

    let headersInfo = getAuthHeadersOfApplicationJson();
    let navigate = useNavigate();

    const [isDisabled , setIsDisabled] = useState(false);
    const [formValues , setFormValues] = useState({
        title : "",
        description : "",
        company : "",
        workExperience : "",
        openings:0,
        salary : "",
        location : "",
        qualification : "",
        jobType : "",
        requirements : "",
    })

    function handleChange(e)
    {
        let {name , value} = e.target;

        let sanitize = removeDomElementsFromInput(value);
        value = sanitize;

        if(name == "title" || name =="location")
        {
            value = value.charAt(0).toUpperCase() + value.slice(1);
            setFormValues({...formValues, [name] : value})
        }
        
        if(name == "openings")
        {
            setFormValues({...formValues , openings : parseInt(value) || ""});
        }
        else {
            setFormValues({...formValues , [name] : value})
        }
        
    }

    async function handleSubmit()
    {
        let data = {
            ...formValues,
            openings : formValues.openings?.toString() || ""
        }

        try {
            setIsDisabled(true)
            let res = await axios.post(`${commonEndPoints}/createJobs`,data ,{headers : headersInfo});
            if(res.data.success)
            {
                toast.success(res.data.message);
                setTimeout(()=>{
                    navigate("/admin/jobs");
                    setIsDisabled(false)
                },2500)
            }
        } catch (error) {
            console.log(error);
            setIsDisabled(false)
            toast.error(error.response?.data?.message);
        }
    }

    return (
        <> 
        <NavBar />
        <AlertMessage />
        <div className='max-w-2xl mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg'>
            <div className='flex items-center justify-between mb-6'>
                <button onClick={()=> navigate("/admin/jobs")}  className='bg-[#2d2d2d] text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none'>
                    Go Back
                </button>
            </div>
            <div className='bg-[#cebce0] p-4 rounded-lg'>
                <h1 className='text-2xl font-semibold text-center mb-2'>Create Job Listing</h1>
                <p className='text-red-600 text-center'>All are Required Fields</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 '>Enter Job Title</label>
                        <input 
                            value={formValues.title}
                            type="text" 
                            onChange={handleChange}
                            autoComplete='off'
                            name='title'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Select Company </label>        
                        <select
                            className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-300 focus:ring-2'
                            onChange={handleChange}
                            name='company'
                        >
                            <option value="">Select Company </option>
                        {
                            companiesList && companiesList.length && companiesList.map((val,index)=>(
                                <option key={index} value={val.companyId}>{val?.companyName}</option>
                            ))
                        }
                        </select>
                    </div>                    
                    <div className='sm:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700'>Enter Job Description</label>
                        <textarea 
                            onChange={handleChange}
                            autoComplete='off'
                            name='description'
                            rows={3}
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div className=''>
                        <label className='block text-sm font-medium text-gray-700 '>Enter Work Experience (years)</label>
                        <input 
                            type="text" 
                            onChange={handleChange}
                            autoComplete='off'
                            name='workExperience'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Enter No Of Openings</label>
                        <input 
                            type="text" 
                            value={formValues.openings}
                            onChange={handleChange}
                            autoComplete='off'
                            name='openings'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Enter Salary Range &#8377; (LPA)</label>
                        <input 
                            type="text" 
                            onChange={handleChange}
                            autoComplete='off'
                            name='salary'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Enter Location</label>
                        <input 
                            type="text" 
                            value={formValues.location}
                            onChange={handleChange}
                            autoComplete='off'
                            name='location'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                    <div className='sm:col-span-2 mt-2'>
                        <label className='block text-sm font-medium text-gray-700'>Enter Qualification</label>
                        <textarea 
                            rows={2}
                            onChange={handleChange}
                            autoComplete='off'
                            name='qualification'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                            >
                        </textarea>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Select Employment Type </label>        
                        <select
                            className='w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300'
                            onChange={handleChange}
                            name='jobType'
                        >
                            <option value="">Select Job Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Enter Requirements</label>
                        <input 
                            type="text" 
                            onChange={handleChange}
                            autoComplete='off'
                            name='requirements'
                            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                    </div>
                </div>
                {
                    companiesList && companiesList.length ==0 ? (
                        <p className='font-semibold text-red-700 text-center mt-2'> ***Please Register Company To Create Jobs Opening</p>
                    ) :
                    <div className='mt-3'>
                    {
                        isDisabled ?  
                        <button disabled={isDisabled} className='w-full bg-blue-500 p-2 text-white rounded-md cursor-not-allowed'>Please Wait...</button> 
                        : <button onClick={handleSubmit} className='w-full bg-blue-500 hover:bg-purple-600 p-2 text-white rounded-md'>Proceed</button>
                    }                        
                </div>
                }
                
            </div>
        </div>
        </>
    )
}

export default CreateJobs
