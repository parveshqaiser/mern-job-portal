import React, { useEffect } from 'react'
import LatestJobCards from './LatestJobCards';

import {useSelector } from 'react-redux';

const LatestJobOpenings = () => {

    let jobs = useSelector(store => store?.job?.allJobs);


    return (
        <div className='my-10 max-w-7xl mx-auto sm:px-6'>
            <h1 className='font-bold text-3xl text-center'>Current Openings & <span className='text-orange-500'>Positions</span> </h1>
            <div className='grid grid-cols-1 md:grid-cols-3  gap-3 my-5'>
                {
                    jobs && jobs.length ? 
                    (jobs?.slice(0,6)?.map(val => <LatestJobCards val={val} key={val?._id}/>)) : 
                    (<div className='flex items-center justify-center ml-10 text-red-500'>No Jobs Available</div>)
                }
                {/* // {data.map(val=> <LatestJobCards />)} */}
            </div>
        </div>
    )
}

export default LatestJobOpenings;
