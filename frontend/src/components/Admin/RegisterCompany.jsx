
import React, { useState } from 'react'
import NavBar from '../NavBar'
import { useNavigate } from 'react-router-dom';
import {getAuthHeaders} from '../../shared/authorization';
import { removeDomElementsFromInput } from '../../utils/domSanitize';
import { toast } from 'react-toastify';
import { AlertMessage } from '../../utils/toastify';
import axios from 'axios';
import { commonEndPoints } from '../../utils/api';

const RegisterCompany = () => {

    let navigate = useNavigate();

    let {headerInfo} = getAuthHeaders();

    const [isDisabled , setIsDisabled] = useState(false);
    const [formValues , setFormValues] = useState({
        companyName : "",
        description : "",
        website : "",
        location : "",
        file : "",
    });

    function handleChange(e)
    {
        let {name, value} = e.target;

        let sanitize = removeDomElementsFromInput(value);
        value = sanitize;

        if(name == "companyName" || name =="description" || name == "location")
        {
            value = value.charAt(0).toUpperCase() + value.slice(1);
            setFormValues({...formValues, [name] : value})
        }else {
            setFormValues({...formValues, [name] : value})
        }
    }

    function handleFileChange(e)
    {
        let file = e.target.files;
        console.log("file ", file[0]);
        setFormValues({...formValues, file : file[0]})
    }

    async function handleSubmit()
    {
        let {companyName, description, website,location} = formValues;

        if(!companyName || companyName.startsWith(" "))
        {
            toast.warning("Company Name Required");
            return;
        }

        if(!description || description.startsWith(" "))
        {
            toast.warning("Description Required");
            return;
        }

        if(!website || website.startsWith(" "))
        {
            toast.warning("Description Required");
            return;
        }

        let formData = new FormData();
        formData.append("companyName", companyName || "");
        formData.append("description", description || "");
        formData.append("location", location || "");
        formData.append("website", website || "");

        if(formValues.file){
            formData.append("file", formValues.file || "");
        }

        formData.forEach((key, val)=>{
            console.log(val ,key);
        })

        try {
            setIsDisabled(true)
            let res = await axios.post(`${commonEndPoints}/registerCompany`, formData,{headers :headerInfo});
            if(res.data.success)
            {
                toast.success(res.data.message);
                setTimeout(()=>{
                    setIsDisabled(false)
                    navigate("/admin/companies");
                },2500)
            }
        } catch (error) {
            console.log("** ", error);
            toast.error(error?.response?.data?.message);
            setIsDisabled(false)
        }
    }

    return (
        <>
            <NavBar />
            <AlertMessage />
            <div className='max-w-2xl mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg'>
                <div className='flex items-center justify-between mb-6'>
                    <button onClick={()=> navigate("/admin/companies")}  className='bg-[#2d2d2d] text-white p-2 rounded-md hover:bg-indigo-500 focus:outline-none'>
                        Go Back
                    </button>
                </div>
                <div className='bg-purple-100 p-6 rounded-lg'>
                    <h1 className='text-2xl font-semibold text-center mb-4'>Company Registration</h1>
                    <div className='space-y-4'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center mb-2'>
                            <label className='text-sm font-medium text-gray-700 w-full sm:w-1/3'>Enter Company Name :</label>
                            <input 
                                type="text" 
                                value={formValues.companyName}
                                onChange={handleChange}
                                autoComplete='off'
                                name='companyName'
                                placeholder='Company Name'
                                className='w-full sm:w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 mt-2 sm:mt-0'
                                // className="w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center mb-2'>
                            <label className='text-sm font-medium text-gray-700 w-full sm:w-1/3'>Enter Description :</label>
                            <input 
                                type="text" 
                                value={formValues.description}
                                onChange={handleChange}
                                autoComplete='off'
                                name='description'
                                placeholder='Description'
                                className='w-full sm:w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 mt-2 sm:mt-0'
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center mb-2'>
                            <label className='text-sm font-medium text-gray-700 w-1/3'>Enter Website :</label>
                            <input 
                                type="text" 
                                value={formValues.website}
                                onChange={handleChange}
                                autoComplete='off'
                                name='website'
                                placeholder='Website URL'
                                className='w-full sm:w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 mt-2 sm:mt-0'                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                            <label className='text-sm font-medium text-gray-700 w-full sm:w-1/3'>Enter Location :</label>
                            <input 
                                type="text" 
                                value={formValues.location}
                                autoComplete='off'
                                onChange={handleChange}
                                name='location'
                                placeholder='Location'
                                className='w-full sm:w-2/3 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 mt-2 sm:mt-0'
                            />
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center mb-2'>
                            <label className='text-sm font-medium text-gray-700 mb-1 w-1/3'>Enter Logo :</label>
                            <input 
                                type="file" 
                                accept="image/png,image/jpeg"
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
        </>
    )
}

export default RegisterCompany;


