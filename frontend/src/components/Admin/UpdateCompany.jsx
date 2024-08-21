
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertMessage } from '../../utils/toastify';
import NavBar from '../NavBar';
import { getAuthHeaders } from '../../shared/authorization';
import axios from 'axios';
import { commonEndPoints } from '../../utils/api';
import { toast } from 'react-toastify';

const UpdateCompany = () => {

    const {id} = useParams();

    let navigate = useNavigate();
    let {headerInfo} = getAuthHeaders();

    const [isDisabled , setIsDisabled] = useState(false);
    const [isLoading , setIsLoading] = useState(true);
    const [formValues , setFormValues] = useState({
        companyName : "",
        description : "",
        website : "",
        location : "",
        file : "",
    });

    useEffect(()=>{
        setIsLoading(true);
        getCompany();
        
    },[]);

    async function getCompany()
    {
        try {

            let res= await axios.get(`${commonEndPoints}/getCompany/${id}`, {headers : headerInfo});

            if(res?.data?.success)
            {
                let {companyName , description , location , website} = res?.data?.company;
                // console.log("****** ", companyName , description , location , website);
                setFormValues({
                    companyName :companyName || "",
                    description : description || "",
                    location : location || "",
                    website : website || ""
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.log("error getting company ", error);
        }
    }

    function handleChange(e)
    {
        let {name, value} = e.target;
        setFormValues({...formValues , [name] : value})
    }

    function handleFileChange(e)
    {
        console.log(e.target.files[0]);
        setFormValues({...formValues ,file : e.target?.files[0]})
        
    }

    async function handleSubmit()
    {
        if(!formValues.companyName || formValues.companyName.startsWith(" "))
        {
            toast.warning("Company Name Required");
            return
        }

        let formData = new FormData();
        formData.append("companyName", formValues.companyName || "");
        formData.append("description", formValues.description || "");
        formData.append("location", formValues.location || "");
        formData.append("website", formValues.website || "");

        if(formValues.file){
            formData.append("file", formValues.file || "");
        }
        
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        try {
            setIsDisabled(true);
            let res = await axios.post(`${commonEndPoints}/updateCompany/${id}`, formData , {headers : headerInfo});
            if(res?.data?.success)
            {
                toast.success(res.data.message);
                setTimeout(()=>{
                    navigate("/admin/companies")
                    setIsDisabled(false);
                },2500)
            }
        } catch (error) {
            console.log("err ", error.response);
            toast.error(error?.response?.data?.message);
            setIsDisabled(false);
        }
    }

    return (
        <>
            <NavBar />
            <AlertMessage />
            {
                isLoading ? (<h1 className='font-semibold mt-10 text-center'>Please Wait while Data is Fetched....</h1>) 
                : (
                <div className='max-w-2xl mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg'>
                    <div className='flex items-center justify-between mb-6'>
                        <button onClick={()=> navigate("/admin/companies")}  className='bg-[#2d2d2d] text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none'>
                            Go Back
                        </button>
                    </div>
                    <div className='bg-purple-100 p-6 rounded-lg'>
                        <h1 className='text-2xl font-semibold text-center mb-4'>Update Company Form</h1>
                        <div className='space-y-4'>
                            <div className='flex items-center mb-2'>
                                <label className='text-sm font-medium text-gray-700 w-1/3'>Enter Company Name :</label>
                                <input 
                                    type="text" 
                                    value={formValues.companyName}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    name='companyName'
                                    placeholder='Company Name'
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                            </div>
                            <div className='flex items-center mb-4'>
                                <label className='text-sm font-medium text-gray-700 mb-1 w-1/3'>Enter Description :</label>
                                <input 
                                    type="text" 
                                    value={formValues.description}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    name='description'
                                    placeholder='Description'
                                    className="w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                            </div>
                            <div className='flex items-center mb-4'>
                                <label  className='text-sm font-medium text-gray-700 w-1/3'>Enter Website :</label>
                                <input 
                                    type="text" 
                                    value={formValues.website}
                                    onChange={handleChange}
                                    autoComplete='off'
                                    name='website'
                                    placeholder='Website URL'
                                    className="w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                            </div>
                            <div className='flex items-center'>
                                <label className='text-sm font-medium text-gray-700 mb-1 w-1/3'>Enter Location :</label>
                                <input 
                                    type="text" 
                                    value={formValues.location}
                                    autoComplete='off'
                                    onChange={handleChange}
                                    name='location'
                                    placeholder='Location'
                                    className="w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                                />
                            </div>
                            <div className='flex items-center'>
                                <label className='text-sm font-medium text-gray-700 mb-1 w-1/3'>Enter Logo :</label>
                                <input 
                                    type="file" 
                                    name='file'
                                    onChange={handleFileChange}
                                />
                            </div>
                            {
                                isDisabled ?  <button disabled={isDisabled} className='w-full bg-blue-500 p-2 text-white rounded-md cursor-not-allowed'>Please Wait...</button> 
                                : <button onClick={handleSubmit} className='w-full bg-blue-500 hover:bg-purple-600 p-2 text-white rounded-md'>Proceed</button>
                            }                        
                        </div>
                    </div>
                </div>
                )
            }
           
        </>
    )
}

export default UpdateCompany
