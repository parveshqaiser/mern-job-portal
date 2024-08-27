
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { storeSearchQuery } from '../shared/jobsSlice';

import {useNavigate} from "react-router-dom";

const MainSection = () => {

    const [searchText , setSearchText] = useState("");

    let dispatch = useDispatch();
    let navigate = useNavigate();

    function handleSearch()
    {
        dispatch(storeSearchQuery(searchText));
        navigate("/browse");
    }
    
    return (
        <div className='mt-3 text-center md:px-0'>
            <div className='flex flex-col gap-4 text-center'>
                <h1 className='text-xl sm:text-2xl bg-gray-200 max-w-[90%] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto rounded-md py-2 px-4'>Your Dream Job is Just a Click Away</h1>
                <span className='text-3xl font-bold'>Discover, Apply & <br/> <span className='text-orange-500'> Get Your Dream Job</span> </span>
            </div>
            <p className='mt-2  text-gray-600'>
                Find the <span className='text-blue-500 text-lg font-medium'>Perfect Job</span> , wherever you are. <br />
                <span className='text-blue-500 text-lg font-medium'>Remote</span> or <span className='text-blue-500 text-lg font-medium'>on-site</span>  , your next opportunity awaits.
            </p>
            <div className='flex w-full sm:w-[60%] md:w-[45%] shadow-lg border border-gray-200 items-center pl-2 gap-2 rounded-full mx-auto mt-3'> 
                <input 
                    type='text' 
                    onChange={(e)=> e.target.value? setSearchText(e.target.value) : setSearchText("")}
                    placeholder="Start Searching by job title"
                    className='w-full border-none outline-none pl-2 bg-transparent'
                />
                <button 
                    onClick={handleSearch}
                    className='h-10 px-3 rounded-full bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-colors'
                >
                    Search
                </button>               
            </div>
        </div>
    )
}

export default MainSection
